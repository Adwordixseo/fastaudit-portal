import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Circle, Store, Building2, Loader2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'fastaudit_onboarding_dismissed';

export default function OnboardingWalkthrough({ user }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company: user?.company || '',
    phone: user?.phone || '',
    location: user?.location || '',
    website: user?.website || '',
    gmb_url: user?.gmb_url || '',
  });

  const needsOnboarding = useMemo(() => {
    if (!user) return false;
    if (typeof window === 'undefined') return false;
    const dismissed = localStorage.getItem(STORAGE_KEY) === '1';
    if (dismissed) return false;
    const missing = !user.gmb_url || !user.company || !user.phone || !user.location || !user.website;
    return missing;
  }, [user]);

  // Open automatically when onboarding is needed
  React.useEffect(() => {
    if (needsOnboarding && !open) setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsOnboarding]);

  const steps = [
    { key: 'business', label: 'Business profile', icon: Building2, fields: ['company', 'phone', 'location', 'website'] },
    { key: 'gmb', label: 'Google My Business', icon: Store, fields: ['gmb_url'] },
  ];

  const currentStep = steps[step];
  const isLast = step === steps.length - 1;

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        company: form.company || undefined,
        phone: form.phone || undefined,
        location: form.location || undefined,
        website: form.website || undefined,
        gmb_url: form.gmb_url || undefined,
      });
      toast({ title: 'Profile updated', description: 'Your business details have been saved.' });
      localStorage.setItem(STORAGE_KEY, '1');
      setOpen(false);
    } catch (err) {
      toast({ title: 'Could not save', description: err.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setOpen(false);
  };

  const handleNext = () => {
    if (!isLast) setStep((s) => s + 1);
    else handleSave();
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const stepValid = () => {
    if (currentStep.key === 'business') return form.company && form.phone && form.location && form.website;
    return true; // GMB is optional
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
              <Sparkles className="h-3.5 w-3.5" /> Onboarding
            </span>
          </div>
          <DialogTitle className="text-2xl">Let's set up your account</DialogTitle>
          <DialogDescription>
            Complete these two quick steps so we can tailor your audits and reports to your business.
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center justify-between px-2 py-2">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <React.Fragment key={s.key}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${active ? 'border-indigo-600 bg-indigo-600 text-white' : done ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200 bg-white text-slate-400'}`}>
                    {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className={`text-xs font-medium ${active ? 'text-indigo-600' : done ? 'text-slate-700' : 'text-slate-400'}`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`mx-2 h-0.5 flex-1 rounded-full ${i < step ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step content */}
        <div className="space-y-4 py-2">
          {currentStep.key === 'business' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="ob-company">Company name</Label>
                <Input id="ob-company" value={form.company} onChange={(e) => update('company', e.target.value)} placeholder="Acme Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ob-phone">Phone number</Label>
                <Input id="ob-phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 555 123 4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ob-location">Business location</Label>
                <Input id="ob-location" value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="City, Country" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ob-website">Website URL</Label>
                <Input id="ob-website" type="url" value={form.website} onChange={(e) => update('website', e.target.value)} placeholder="https://yourwebsite.com" />
              </div>
            </>
          )}
          {currentStep.key === 'gmb' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                <div className="flex items-start gap-3">
                  <Store className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Link your Google My Business profile</p>
                    <p className="mt-0.5 text-xs text-slate-500">Connecting your GMB listing helps us audit your local SEO visibility and Google Maps rankings.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ob-gmb">Google My Business URL</Label>
                <Input id="ob-gmb" type="url" value={form.gmb_url} onChange={(e) => update('gmb_url', e.target.value)} placeholder="https://maps.google.com/your-business" />
                <p className="text-xs text-slate-400">Find this by opening your listing on Google Maps and copying the URL from the address bar.</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button variant="ghost" size="sm" onClick={handleSkip} disabled={saving} className="text-slate-500">
            Skip for now
          </Button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button variant="outline" size="sm" onClick={handleBack} disabled={saving}>
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
            )}
            <Button size="sm" onClick={handleNext} disabled={saving || !stepValid()}>
              {saving ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : isLast ? (
                'Finish'
              ) : (
                <>
                  Next <ArrowRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}