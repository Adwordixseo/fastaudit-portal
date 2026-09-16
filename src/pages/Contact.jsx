import React, { useState } from 'react';
import { Loader2, Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

const initialForm = { name: '', phone: '', email: '', company: '', location: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in your name, email and message.');
      return;
    }
    setLoading(true);
    try {
      const res = await base44.functions.invoke('sendContactEnquiry', form);
      if (res?.data?.ok) {
        setSent(true);
        setForm(initialForm);
        toast.success('Your message has been sent!');
      } else {
        throw new Error(res?.data?.error || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err.message || 'Could not send your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Contact</span>
            <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">Let's talk about your growth</h1>
            <p className="mt-4 text-slate-500">Have a question about our SEO packages, audits or reporting? Fill out the form and our team will get back to you within 24 hours.</p>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            {/* Contact info */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><Phone className="h-5 w-5" /></div>
                  <h3 className="text-base font-semibold text-slate-900">Phone</h3>
                </div>
                <div className="mt-4 space-y-1.5">
                  <a href="tel:9953269191" className="block text-sm text-slate-600 hover:text-indigo-600">+91-9953269191</a>
                  <a href="tel:+918104330050" className="block text-sm text-slate-600 hover:text-indigo-600">+91-8104330050</a>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><Mail className="h-5 w-5" /></div>
                  <h3 className="text-base font-semibold text-slate-900">Email</h3>
                </div>
                <div className="mt-4">
                  <a href="mailto:info@adwordix.com" className="text-sm text-slate-600 hover:text-indigo-600">info@adwordix.com</a>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><MapPin className="h-5 w-5" /></div>
                  <h3 className="text-base font-semibold text-slate-900">Offices</h3>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">India Office</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">Adwordix (S.S Technologies)<br />Phase 1, 359, Sector 28, Gurugram, Haryana (122001)</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">USA Office</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">Adwordix LLC<br />30 N Gould St Ste R, Sheridan, Wyoming USA (82801)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              {sent ?
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-green-50 text-green-600"><CheckCircle2 className="h-8 w-8" /></div>
                  <h3 className="mt-5 text-xl font-bold text-slate-900">Message sent!</h3>
                  <p className="mt-2 max-w-sm text-sm text-slate-500">Thank you for reaching out. Our team will get back to you at the email you provided within 24 hours.</p>
                  <Button variant="outline" className="mt-6 rounded-full" onClick={() => setSent(false)}>Send another message</Button>
                </div> :

              <form onSubmit={submit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="c-name">Name <span className="text-red-500">*</span></Label>
                      <Input id="c-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your full name" className="mt-1.5" required />
                    </div>
                    <div>
                      <Label htmlFor="c-phone">Phone Number</Label>
                      <Input id="c-phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" className="mt-1.5" />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="c-email">Email <span className="text-red-500">*</span></Label>
                      <Input id="c-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@company.com" className="mt-1.5" required />
                    </div>
                    <div>
                      <Label htmlFor="c-company">Company Name</Label>
                      <Input id="c-company" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Your company" className="mt-1.5" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="c-location">Location</Label>
                    <Input id="c-location" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="City, Country" className="mt-1.5" />
                  </div>

                  <div>
                    <Label htmlFor="c-message">Message <span className="text-red-500">*</span></Label>
                    <Textarea id="c-message" value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Tell us how we can help..." rows={5} className="mt-1.5 resize-none" required />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full rounded-full py-2.5 text-base shadow-lg shadow-indigo-500/25">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <><Send className="h-4 w-4" /> Send message</>}
                  </Button>
                  <p className="text-center text-xs text-slate-400">Your enquiry will be sent to info@adwordix.com</p>
                </form>
              }
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>);

}