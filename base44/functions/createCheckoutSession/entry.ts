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
    if (!packageId || !amount || amount <= 0) return Response.json({ error: 'Package and amount are required' }, { status: 400 });

    const intervalCount = CYCLE_MONTHS[cycle];
    const origin = req.headers.get('origin') || 'https://apricot-audit-growth-flow.base44.app';
    const successUrl = `${origin}/app/packages?paid=1`;
    const cancelUrl = `${origin}/app/packages?canceled=1`;
    const appId = secrets.get('BASE44_APP_ID') || '';

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

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secrets.get('STRIPE_SECRET_KEY')}`,
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