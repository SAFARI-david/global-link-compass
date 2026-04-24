import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  User, Plane, MapPin, Users, FileText, CheckCircle,
  ArrowLeft, ArrowRight, Check, Info, Globe,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FeeAcknowledgment } from "@/components/FeeAcknowledgment";

export const Route = createFileRoute("/apply/visit-visa")({
  head: () => ({
    meta: [
      { title: "Apply for Visit Visa — Global Link Migration Services" },
      { name: "description", content: "Start your visit visa application. Tourism, family visit, or business — we handle everything." },
      { property: "og:title", content: "Apply for Visit Visa — Global Link Migration Services" },
      { property: "og:description", content: "Start your visit visa application with our step-by-step form." },
    ],
  }),
  component: VisitVisaPage,
});

const STEPS = [
  { label: "Personal Info", icon: User },
  { label: "Passport & Travel", icon: Plane },
  { label: "Visit Details", icon: Globe },
  { label: "Dependants", icon: Users },
  { label: "Documents", icon: FileText },
  { label: "Review & Submit", icon: CheckCircle },
];

function InputField({ label, placeholder, type = "text", required = true, value, onChange }: {
  label: string; placeholder?: string; type?: string; required?: boolean;
  value?: string; onChange?: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        required={required}
      />
    </div>
  );
}

function SelectField({ label, options, required = true, value, onChange }: {
  label: string; options: string[]; required?: boolean;
  value?: string; onChange?: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <select
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        required={required}
      >
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function VisitVisaPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  function u(key: string, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("applications").insert({
        application_type: "Visit Visa",
        destination_country: form.destination_country || null,
        user_id: user?.id || null,
        form_data: form as any,
        reference_number: "placeholder",
      });
      if (error) throw error;
      toast.success("Visit visa application submitted successfully!");
      navigate({ to: user ? "/dashboard" : "/" });
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  }

  const canNext = () => {
    if (step === 0) return form.full_name && form.email && form.nationality;
    if (step === 1) return form.has_passport && form.passport_number;
    if (step === 2) return form.destination_country && form.purpose_of_visit;
    return true;
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-navy-gradient text-primary-foreground py-10">
        <div className="container-narrow text-center">
          <h1 className="text-2xl font-bold lg:text-3xl font-heading">Visit Visa Application</h1>
          <p className="mt-2 text-sm opacity-80">Tourism, family visits, or business — complete the form below to get started.</p>
        </div>
      </div>

      {/* Progress */}
      <div className="border-b bg-card">
        <div className="container-narrow py-4">
          <div className="flex items-center justify-between gap-1">
            {STEPS.map((s, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  i < step ? "bg-primary text-primary-foreground" :
                  i === step ? "bg-gold text-gold-foreground" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className="text-[10px] font-medium text-muted-foreground hidden sm:block">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container-narrow py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Personal Information</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField label="Full Name (as in passport)" value={form.full_name} onChange={(v) => u("full_name", v)} />
                  <InputField label="Date of Birth" type="date" value={form.dob} onChange={(v) => u("dob", v)} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField label="Gender" options={["Male", "Female", "Other"]} value={form.gender} onChange={(v) => u("gender", v)} />
                  <InputField label="Nationality" value={form.nationality} onChange={(v) => u("nationality", v)} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField label="Email Address" type="email" value={form.email} onChange={(v) => u("email", v)} />
                  <InputField label="Phone Number" value={form.phone} onChange={(v) => u("phone", v)} required={false} />
                </div>
                <InputField label="Country of Residence" value={form.country_of_residence} onChange={(v) => u("country_of_residence", v)} />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Passport & Travel History</h2>
                <SelectField label="Do you have a valid passport?" options={["Yes", "No", "Expired"]} value={form.has_passport} onChange={(v) => u("has_passport", v)} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField label="Passport Number" value={form.passport_number} onChange={(v) => u("passport_number", v)} />
                  <InputField label="Passport Expiry Date" type="date" value={form.passport_expiry} onChange={(v) => u("passport_expiry", v)} />
                </div>
                <InputField label="Country of Issue" value={form.passport_country} onChange={(v) => u("passport_country", v)} />
                <SelectField label="Have you travelled internationally before?" options={["Yes", "No"]} value={form.prev_travel} onChange={(v) => u("prev_travel", v)} />
                {form.prev_travel === "Yes" && (
                  <InputField label="Countries visited (comma-separated)" value={form.countries_visited} onChange={(v) => u("countries_visited", v)} required={false} />
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Visit Details</h2>
                <SelectField label="Destination Country" options={["Canada", "United Kingdom", "Australia", "Germany", "United States", "France", "United Arab Emirates", "Other"]} value={form.destination_country} onChange={(v) => u("destination_country", v)} />
                <SelectField label="Purpose of Visit" options={["Tourism / Sightseeing", "Family Visit", "Business Meeting", "Medical Treatment", "Conference / Event", "Short Course / Training", "Other"]} value={form.purpose_of_visit} onChange={(v) => u("purpose_of_visit", v)} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField label="Expected Travel Date" type="date" value={form.travel_date} onChange={(v) => u("travel_date", v)} />
                  <InputField label="Duration of Stay" value={form.duration} onChange={(v) => u("duration", v)} placeholder="e.g. 2 weeks, 3 months" />
                </div>
                <SelectField label="Do you have a sponsor or host in the destination country?" options={["Yes", "No"]} value={form.has_sponsor} onChange={(v) => u("has_sponsor", v)} />
                {form.has_sponsor === "Yes" && (
                  <InputField label="Sponsor / Host Details" value={form.sponsor_details} onChange={(v) => u("sponsor_details", v)} placeholder="Name, relationship, address" />
                )}
                <SelectField label="Have you been refused a visa before?" options={["No", "Yes"]} value={form.prev_refusal} onChange={(v) => u("prev_refusal", v)} />
                {form.prev_refusal === "Yes" && (
                  <InputField label="Refusal Details" value={form.refusal_details} onChange={(v) => u("refusal_details", v)} placeholder="Country, year, reason" required={false} />
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Dependants</h2>
                <SelectField label="Will anyone travel with you?" options={["No", "Yes — Spouse", "Yes — Children", "Yes — Spouse & Children"]} value={form.has_dependants} onChange={(v) => u("has_dependants", v)} />
                {form.has_dependants && form.has_dependants !== "No" && (
                  <>
                    <InputField label="Number of dependants" type="number" value={form.dependants_count} onChange={(v) => u("dependants_count", v)} />
                    <InputField label="Dependant names & dates of birth" value={form.dependant_details} onChange={(v) => u("dependant_details", v)} placeholder="Name — DOB, one per line" required={false} />
                  </>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Documents</h2>
                <p className="text-sm text-muted-foreground">You can upload documents now or after submission. Our team will guide you on exactly what's needed.</p>
                <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Document upload will be available after submission</p>
                  <p className="text-xs text-muted-foreground mt-1">Typically required: passport copy, bank statements, invitation letter, travel itinerary</p>
                </div>
                <InputField label="Additional Notes" value={form.additional_notes} onChange={(v) => u("additional_notes", v)} required={false} />
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Review & Submit</h2>
                <div className="rounded-lg border bg-card p-4 space-y-3 text-sm">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div><span className="text-muted-foreground">Name:</span> <strong>{form.full_name}</strong></div>
                    <div><span className="text-muted-foreground">Email:</span> <strong>{form.email}</strong></div>
                    <div><span className="text-muted-foreground">Nationality:</span> <strong>{form.nationality}</strong></div>
                    <div><span className="text-muted-foreground">Destination:</span> <strong>{form.destination_country}</strong></div>
                    <div><span className="text-muted-foreground">Purpose:</span> <strong>{form.purpose_of_visit}</strong></div>
                    <div><span className="text-muted-foreground">Travel Date:</span> <strong>{form.travel_date || "Not set"}</strong></div>
                    <div><span className="text-muted-foreground">Duration:</span> <strong>{form.duration || "Not specified"}</strong></div>
                    <div><span className="text-muted-foreground">Dependants:</span> <strong>{form.has_dependants || "None"}</strong></div>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-4">
                  <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">What happens next?</p>
                    <p className="text-muted-foreground mt-1">Our team will review your application, send you a document checklist, and provide a fee breakdown. No payment is required at this stage.</p>
                  </div>
                </div>
                <FeeAcknowledgment
                  amount={400}
                  currency="USD"
                  serviceLabel="Visit Visa Application"
                  onConfirmChange={(v) => u("fee_confirmed", v ? "true" : "")}
                />
                <label className="flex items-start gap-2 text-sm">
                  <input type="checkbox" className="mt-1 rounded" checked={form.declaration === "true"} onChange={(e) => u("declaration", e.target.checked ? "true" : "")} />
                  <span>I confirm all information provided is accurate. I understand that false information may result in application refusal.</span>
                </label>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t">
          <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button variant="gold" onClick={() => setStep(step + 1)} disabled={!canNext()}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button variant="gold" onClick={handleSubmit} disabled={submitting || form.declaration !== "true"}>
              {submitting ? "Submitting…" : "Submit Application"} <Check className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
