import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

const CYCLE_MONTHS = { monthly: 1, quarterly: 3, yearly: 12 };

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const packageId = String(body?.package_id || '');
    const packageName = String(body?.package_name || 'Subscription');
    const cycle = ['monthly', 'quarterly', 'yearly'].includes(body?.cycle) ? body.cycle : 'monthly';
    const amount = Number(body?.amount);
    const couponCode = String(body?.coupon || '').trim();
    if (!packageId || !amount || amount <= 0) return Response.json({ error: 'Package and amount are required' }, { status: 400 });

    // Validate coupon, if one was provided
    let discountPercent = 0;
    let couponId = '';
    if (couponCode) {
      const coupons = await base44.entities.Coupon.filter({ code: couponCode, active: true });
      const coupon = coupons[0];
      if (!coupon) return Response.json({ error: 'Invalid or inactive coupon code' }, { status: 400 });
      if (coupon.max_uses > 0 && (coupon.uses || 0) >= coupon.max_uses) return Response.json({ error: 'This coupon has reached its usage limit' }, { status: 400 });
      discountPercent = Math.max(0, Math.min(100, Number(coupon.discount_percent) || 0));
      couponId = coupon.code;
    }

    const intervalCount = CYCLE_MONTHS[cycle];
    const origin = req.headers.get('origin') || 'https://apricot-audit-growth-flow.base44.app';
    const successUrl = `${origin}/app/packages?paid=1`;
    const cancelUrl = `${origin}/app/packages?canceled=1`;
    const appId = secrets.get('BASE44_APP_ID') || '';
    // Use test keys in preview/sandbox environments so test cards work; live keys on the published domain.
    const isPreview = /preview|sandbox|localhost|127\.0\.0\.1/i.test(origin);
    const stripeKey = isPreview ? (secrets.get('STRIPE_TEST_SECRET_KEY') || secrets.get('STRIPE_SECRET_KEY')) : secrets.get('STRIPE_SECRET_KEY');

    const params = new URLSearchParams();
    params.append('mode', 'subscription');
    params.append('line_items[0][quantity]', '1');
    params.append('line_items[0][price_data][currency]', 'usd');
    params.append('line_items[0][price_data][unit_amount]', String(Math.round(amount * 100)));
    params.append('line_items[0][price_data][product_data][name]', packageName);
    params.append('line_items[0][price_data][recurring][interval]', 'month');
    params.append('line_items[0][price_data][recurring][interval_count]', String(intervalCount));
    params.append('metadata[base44_app_id]', appId);
    params.append('metadata[client_id]', user.id);
    params.append('metadata[client_email]', user.email || '');
    params.append('metadata[package_id]', packageId);
    params.append('metadata[package_name]', packageName);
    params.append('metadata[cycle]', cycle);
    params.append('metadata[amount]', String(amount));
    params.append('subscription_data[metadata][base44_app_id]', appId);
    params.append('subscription_data[metadata][client_id]', user.id);
    params.append('subscription_data[metadata][client_email]', user.email || '');
    params.append('subscription_data[metadata][package_id]', packageId);
    params.append('subscription_data[metadata][package_name]', packageName);
    params.append('subscription_data[metadata][cycle]', cycle);
    params.append('success_url', successUrl);
    params.append('cancel_url', cancelUrl);

    // Apply coupon discount, if a valid code was supplied
    if (couponId) {
      // Reuse an existing Stripe coupon (id = code) when present, otherwise create it with the configured discount
      try {
        // fall through and reuse if the coupon already exists with the same discount
        const couponRes = await fetch(`https://api.stripe.com/v1/coupons/${encodeURIComponent(couponId)}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${stripeKey}`, 'Stripe-Version': '2025-10-29.clover' }
        });
        const couponData = await couponRes.json();
        if (!couponRes.ok || couponData.valid === false) {
          // If the GET failed or the coupon is invalid, try to create it fresh
          const createRes = await fetch('https://api.stripe.com/v1/coupons', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${stripeKey}`, 'Stripe-Version': '2025-10-29.clover', 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              id: couponId,
              name: couponId,
              percent_off: String(discountPercent),
              duration: 'once'
            }).toString()
          });
          const createData = await createRes.json();
          // "already exists" is fine — the coupon valid at least once; otherwise surface the error
          if (!createRes.ok && !/already exists/i.test(createData?.error?.message || '')) {
            console.error('Stripe coupon error', createData?.error?.message);
            return Response.json({ error: createData?.error?.message || 'Could not apply coupon' }, { status: 400 });
          }
        }
      } catch (couponError) {
        console.error('Stripe coupon error', couponError);
        return Response.json({ error: 'Could not apply coupon' }, { status: 400 });
      }
      params.append('discounts[0][coupon]', couponId);
      params.append('metadata[coupon]', couponId);
      params.append('metadata[discount_percent]', String(discountPercent));
      params.append('metadata[amount_before_discount]', String(amount));
      params.append('subscription_data[metadata][coupon]', couponId);
      params.append('subscription_data[metadata][discount_percent]', String(discountPercent));
    }

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Stripe-Version': '2025-10-29.clover',
        'Idempotency-Key': crypto.randomUUID(),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('Stripe checkout error', data?.error?.message);
      return Response.json({ error: data?.error?.message || 'Stripe error' }, { status: 400 });
    }
    return Response.json({ url: data.url });
  } catch (error) {
    console.error('createCheckoutSession error', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}