import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  User, Plane, Globe, Users, FileText, Sparkles,
  ArrowLeft, ArrowRight, CheckCircle2, Shield, Clock, MapPin,
  Upload, X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/apply/visit-visa")({
  head: () => ({
    meta: [
      { title: "Visit Visa Application — Global Link Migration Services" },
      { name: "description", content: "Start your guided visit visa application. Tourism, family, business — we'll review your case and confirm the right visa pathway." },
      { property: "og:title", content: "Visit Visa Application — Global Link Migration Services" },
      { property: "og:description", content: "Step-by-step guided visit visa application." },
    ],
  }),
  component: VisitVisaApplicationForm,
});

const STEPS = [
  { label: "Personal", icon: User },
  { label: "Passport & Travel", icon: Plane },
  { label: "Visit Details", icon: Globe },
  { label: "Dependants", icon: Users },
  { label: "Documents", icon: FileText },
  { label: "Review", icon: Sparkles },
];

const DOC_SLOTS: { key: string; label: string; accept: string; type: string }[] = [
  { key: "passport", label: "Passport (bio page)", accept: ".pdf,.jpg,.jpeg,.png", type: "passport" },
  { key: "photo", label: "Recent Photograph", accept: ".jpg,.jpeg,.png", type: "photo" },
  { key: "bank", label: "Bank Statements (last 3 months)", accept: ".pdf,.jpg,.jpeg,.png", type: "financial_proof" },
  { key: "itinerary", label: "Travel Itinerary / Flight Booking", accept: ".pdf,.jpg,.jpeg,.png", type: "other" },
  { key: "hotel", label: "Hotel / Accommodation Booking", accept: ".pdf,.jpg,.jpeg,.png", type: "other" },
  { key: "invitation", label: "Invitation Letter (if applicable)", accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx", type: "reference_letter" },
  { key: "insurance", label: "Travel Insurance", accept: ".pdf,.jpg,.jpeg,.png", type: "other" },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function VisitVisaApplicationForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [declarationConfirmed, setDeclarationConfirmed] = useState(false);
  const [files, setFiles] = useState<Record<string, File>>({});
  const navigate = useNavigate();

  function update(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function setFile(key: string, file: File | null) {
    setFiles((prev) => {
      const next = { ...prev };
      if (file) next[key] = file;
      else delete next[key];
      return next;
    });
  }

  async function handleSubmit() {
    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in at least your name and email.");
      return;
    }
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.from("applications").insert({
        user_id: user?.id || null,
        application_type: "Visit Visa" as any,
        destination_country: formData.destCountry || null,
        form_data: formData as any,
        reference_number: "",
      } as any).select("id, reference_number").single();
      if (error) throw error;
      setRefNumber(data?.reference_number || "");

      // Upload selected documents (requires authenticated user per RLS)
      const fileEntries = Object.entries(files);
      if (fileEntries.length > 0) {
        if (!user) {
          toast.message("Documents not uploaded", {
            description: "Create an account or log in to attach your documents — your application has been saved.",
          });
        } else {
          let uploaded = 0;
          let failed = 0;
          for (const [key, file] of fileEntries) {
            const slot = DOC_SLOTS.find((s) => s.key === key);
            const ext = file.name.split(".").pop();
            const filePath = `${user.id}/${data.id}/${key}-${Date.now()}.${ext}`;
            const { error: upErr } = await supabase.storage
              .from("applicant-documents")
              .upload(filePath, file);
            if (upErr) { failed++; continue; }
            const { error: dbErr } = await supabase.from("documents").insert({
              application_id: data.id,
              user_id: user.id,
              document_type: slot?.type || "other",
              file_name: file.name,
              file_path: filePath,
              file_size: file.size,
              mime_type: file.type,
            } as any);
            if (dbErr) failed++; else uploaded++;
          }
          if (uploaded > 0) toast.success(`${uploaded} document${uploaded > 1 ? "s" : ""} uploaded`);
          if (failed > 0) toast.error(`${failed} document${failed > 1 ? "s" : ""} failed to upload`);
        }
      }

      setSubmitted(true);
      toast.success("Application submitted!");
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleSubmit();
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  if (submitted) {
    return (
      <div className="section-padding">
        <div className="container-narrow">
          <motion.div
            className="mx-auto max-w-lg rounded-xl border bg-card p-8 text-center shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
              <CheckCircle2 className="h-8 w-8 text-gold" />
            </div>
            <h1 className="text-2xl font-bold">Application Submitted!</h1>
            {refNumber && <p className="mt-1 text-sm font-medium text-primary">Reference: {refNumber}</p>}
            <p className="mt-3 text-sm text-muted-foreground">
              Thanks — we'll review your visit visa enquiry and reach out within 24 hours with next steps.
            </p>
            <div className="mt-6 rounded-lg bg-muted/50 p-4 text-left text-sm">
              <h3 className="mb-2 font-semibold">What happens next?</h3>
              <ol className="space-y-1.5 text-muted-foreground">
                <li className="flex gap-2"><span className="font-bold text-gold">1.</span> Our team reviews your travel plans and profile</li>
                <li className="flex gap-2"><span className="font-bold text-gold">2.</span> We confirm the right visa category and document checklist</li>
                <li className="flex gap-2"><span className="font-bold text-gold">3.</span> You provide documents — we prepare your application</li>
                <li className="flex gap-2"><span className="font-bold text-gold">4.</span> We submit and track your application through to a decision</li>
              </ol>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No payment is required at this stage — fees will be confirmed once we've reviewed your case.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/visit"><Button variant="outline">Browse Destinations</Button></Link>
              <Link to="/"><Button>Return Home</Button></Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="gold-divider mx-auto mb-4" />
            <h1 className="text-2xl font-bold md:text-3xl">Visit Visa Application</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Step {step + 1} of {STEPS.length} · Estimated {6 - step} min remaining
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const done = i < step;
                const active = i === step;
                return (
                  <div key={s.label} className="flex flex-col items-center gap-1">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${done ? "border-gold bg-gold text-gold-foreground" : active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground"}`}>
                      {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span className={`hidden text-[10px] md:block ${active ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-muted">
              <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
            </div>
          </div>

          {/* Step Content */}
          <div className="rounded-xl border bg-card p-6 shadow-sm md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {step === 0 && <StepPersonal data={formData} update={update} />}
                {step === 1 && <StepPassport data={formData} update={update} />}
                {step === 2 && <StepVisitDetails data={formData} update={update} />}
                {step === 3 && <StepDependants data={formData} update={update} />}
                {step === 4 && <StepDocuments files={files} setFile={setFile} />}
                {step === 5 && (
                  <StepReview
                    data={formData}
                    confirmed={declarationConfirmed}
                    onConfirm={setDeclarationConfirmed}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between border-t pt-6">
              <Button variant="ghost" onClick={back} disabled={step === 0} className="gap-1">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button
                onClick={next}
                disabled={submitting || (step === STEPS.length - 1 && !declarationConfirmed)}
                className="gap-1 bg-gold text-gold-foreground hover:bg-gold/90"
              >
                {step === STEPS.length - 1
                  ? (submitting ? "Submitting…" : !declarationConfirmed ? "Confirm to continue" : "Submit Application")
                  : "Continue"}{" "}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Trust */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Your data is secure</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> We respond within 24 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Step Components ---- */

interface StepProps { data: Record<string, string>; update: (f: string, v: string) => void; }

function StepPersonal({ data, update }: StepProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">Personal Details</h2>
      <p className="text-sm text-muted-foreground">Tell us about yourself — exactly as it appears on your passport.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Full Name *</Label><Input value={data.fullName || ""} onChange={(e) => update("fullName", e.target.value)} placeholder="As shown in passport" /></div>
        <div><Label>Date of Birth *</Label><Input type="date" value={data.dob || ""} onChange={(e) => update("dob", e.target.value)} /></div>
        <div>
          <Label>Gender</Label>
          <Select value={data.gender || ""} onValueChange={(v) => update("gender", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other / Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Nationality *</Label><Input value={data.nationality || ""} onChange={(e) => update("nationality", e.target.value)} placeholder="e.g. Nigerian" /></div>
        <div><Label>Country of Residence *</Label><Input value={data.residence || ""} onChange={(e) => update("residence", e.target.value)} placeholder="e.g. Nigeria" /></div>
        <div><Label>Phone *</Label><Input type="tel" value={data.phone || ""} onChange={(e) => update("phone", e.target.value)} placeholder="+234..." /></div>
        <div className="sm:col-span-2"><Label>Email *</Label><Input type="email" value={data.email || ""} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" /></div>
      </div>
    </div>
  );
}

function StepPassport({ data, update }: StepProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">Passport & Travel History</h2>
      <p className="text-sm text-muted-foreground">Your travel record helps embassies assess your visa application.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Do you have a valid passport? *</Label>
          <Select value={data.hasPassport || ""} onValueChange={(v) => update("hasPassport", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes, valid</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="no">No passport yet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Passport Number</Label><Input value={data.passportNumber || ""} onChange={(e) => update("passportNumber", e.target.value)} placeholder="Passport number" /></div>
        <div><Label>Passport Expiry Date</Label><Input type="date" value={data.passportExpiry || ""} onChange={(e) => update("passportExpiry", e.target.value)} /></div>
        <div><Label>Country of Issue</Label><Input value={data.passportCountry || ""} onChange={(e) => update("passportCountry", e.target.value)} placeholder="e.g. Nigeria" /></div>
        <div>
          <Label>Travelled internationally before?</Label>
          <Select value={data.prevTravel || ""} onValueChange={(v) => update("prevTravel", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Previous Visa Refusals?</Label>
          <Select value={data.prevRefusal || ""} onValueChange={(v) => update("prevRefusal", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No previous refusals</SelectItem>
              <SelectItem value="one">1 refusal</SelectItem>
              <SelectItem value="multiple">2 or more</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {data.prevTravel === "yes" && (
          <div className="sm:col-span-2">
            <Label>Countries visited (last 5 years)</Label>
            <Input value={data.countriesVisited || ""} onChange={(e) => update("countriesVisited", e.target.value)} placeholder="Comma-separated" />
          </div>
        )}
        {data.prevRefusal && data.prevRefusal !== "none" && (
          <div className="sm:col-span-2">
            <Label>Refusal Details</Label>
            <Textarea value={data.refusalDetails || ""} onChange={(e) => update("refusalDetails", e.target.value)} placeholder="Country, year, reason given…" rows={3} />
          </div>
        )}
      </div>
    </div>
  );
}

function StepVisitDetails({ data, update }: StepProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">Visit Details</h2>
      <p className="text-sm text-muted-foreground">Tell us about the trip you're planning.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Destination Country *</Label>
          <Select value={data.destCountry || ""} onValueChange={(v) => update("destCountry", v)}>
            <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
              <SelectItem value="Germany">Germany</SelectItem>
              <SelectItem value="United States">United States</SelectItem>
              <SelectItem value="France">France</SelectItem>
              <SelectItem value="Schengen Area">Schengen Area</SelectItem>
              <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Purpose of Visit *</Label>
          <Select value={data.purpose || ""} onValueChange={(v) => update("purpose", v)}>
            <SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tourism">Tourism / Sightseeing</SelectItem>
              <SelectItem value="family">Family Visit</SelectItem>
              <SelectItem value="business">Business Meeting</SelectItem>
              <SelectItem value="medical">Medical Treatment</SelectItem>
              <SelectItem value="conference">Conference / Event</SelectItem>
              <SelectItem value="course">Short Course / Training</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Expected Travel Date</Label><Input type="date" value={data.travelDate || ""} onChange={(e) => update("travelDate", e.target.value)} /></div>
        <div><Label>Duration of Stay</Label><Input value={data.duration || ""} onChange={(e) => update("duration", e.target.value)} placeholder="e.g. 2 weeks, 3 months" /></div>
        <div>
          <Label>Sponsor or host in destination?</Label>
          <Select value={data.hasSponsor || ""} onValueChange={(v) => update("hasSponsor", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="family">Yes — Family/Friend</SelectItem>
              <SelectItem value="company">Yes — Company/Business</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Funding for the Trip</Label>
          <Select value={data.funding || ""} onValueChange={(v) => update("funding", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="self">Self-funded</SelectItem>
              <SelectItem value="sponsor">Sponsored</SelectItem>
              <SelectItem value="employer">Employer-funded</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {data.hasSponsor && data.hasSponsor !== "no" && (
          <div className="sm:col-span-2">
            <Label>Sponsor / Host Details</Label>
            <Textarea value={data.sponsorDetails || ""} onChange={(e) => update("sponsorDetails", e.target.value)} placeholder="Name, relationship, address, contact…" rows={3} />
          </div>
        )}
      </div>
    </div>
  );
}

function StepDependants({ data, update }: StepProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">Dependants</h2>
      <p className="text-sm text-muted-foreground">Tell us if anyone else will be travelling with you on this visa.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Will anyone travel with you?</Label>
          <Select value={data.hasDependants || ""} onValueChange={(v) => update("hasDependants", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No, just me</SelectItem>
              <SelectItem value="spouse">Spouse</SelectItem>
              <SelectItem value="children">Children</SelectItem>
              <SelectItem value="both">Spouse & Children</SelectItem>
              <SelectItem value="other">Other family member</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {data.hasDependants && data.hasDependants !== "no" && (
          <>
            <div>
              <Label>Number of Dependants</Label>
              <Input type="number" min="1" value={data.dependantsCount || ""} onChange={(e) => update("dependantsCount", e.target.value)} placeholder="e.g. 2" />
            </div>
            <div className="sm:col-span-2">
              <Label>Dependant Names & Dates of Birth</Label>
              <Textarea value={data.dependantDetails || ""} onChange={(e) => update("dependantDetails", e.target.value)} placeholder="Name — DOB — relationship, one per line" rows={4} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StepDocuments({ files, setFile }: { files: Record<string, File>; setFile: (key: string, file: File | null) => void }) {
  function handlePick(key: string, file: File | null) {
    if (!file) { setFile(key, null); return; }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`${file.name} is too large. Max 10MB.`);
      return;
    }
    setFile(key, file);
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">Documents Upload</h2>
      <p className="text-sm text-muted-foreground">
        Upload what you have now — you can also add more later from your dashboard.
        {" "}
        <span className="text-foreground/80">Tip: log in or create an account so we can securely attach your files to this application.</span>
      </p>
      <div className="grid gap-3">
        {DOC_SLOTS.map((doc) => {
          const file = files[doc.key];
          return (
            <div key={doc.key} className="rounded-lg border border-dashed p-4">
              <div className="flex items-start justify-between gap-3">
                <Label className="text-sm">{doc.label}</Label>
                {file && (
                  <button
                    type="button"
                    onClick={() => setFile(doc.key, null)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {file ? (
                <div className="mt-2 flex items-center gap-2 rounded-md bg-muted/50 p-2 text-sm">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span className="flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ) : (
                <label className="mt-2 flex cursor-pointer items-center gap-2 rounded-md border border-dashed bg-background p-2 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground">
                  <Upload className="h-4 w-4" />
                  <span>Choose file</span>
                  <input
                    type="file"
                    accept={doc.accept}
                    className="hidden"
                    onChange={(e) => { handlePick(doc.key, e.target.files?.[0] || null); e.target.value = ""; }}
                  />
                </label>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">Accepted formats: PDF, JPG, PNG, DOC, DOCX. Max 10MB per file.</p>
    </div>
  );
}

function StepReview({ data, confirmed, onConfirm }: { data: Record<string, string>; confirmed: boolean; onConfirm: (v: boolean) => void }) {
  const purposeMap: Record<string, string> = {
    tourism: "Tourism / Sightseeing",
    family: "Family Visit",
    business: "Business Meeting",
    medical: "Medical Treatment",
    conference: "Conference / Event",
    course: "Short Course / Training",
    other: "Other",
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Review Your Application</h2>
      <p className="text-sm text-muted-foreground">Take a moment to check the details below — our team will review your case after you submit.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border bg-muted/30 p-4">
          <MapPin className="mb-2 h-5 w-5 text-gold" />
          <p className="text-xs font-medium text-muted-foreground">Destination</p>
          <p className="mt-0.5 font-bold">{data.destCountry || "Not specified"}</p>
        </div>
        <div className="rounded-lg border bg-muted/30 p-4">
          <Plane className="mb-2 h-5 w-5 text-gold" />
          <p className="text-xs font-medium text-muted-foreground">Purpose</p>
          <p className="mt-0.5 font-bold">{purposeMap[data.purpose || ""] || "Not specified"}</p>
        </div>
        <div className="rounded-lg border bg-muted/30 p-4">
          <Clock className="mb-2 h-5 w-5 text-gold" />
          <p className="text-xs font-medium text-muted-foreground">Travel Date</p>
          <p className="mt-0.5 font-bold">{data.travelDate || "Flexible"}</p>
        </div>
        <div className="rounded-lg border bg-muted/30 p-4">
          <Users className="mb-2 h-5 w-5 text-gold" />
          <p className="text-xs font-medium text-muted-foreground">Travelling With</p>
          <p className="mt-0.5 font-bold">{data.hasDependants && data.hasDependants !== "no" ? `${data.dependantsCount || ""} dependant(s)` : "Just me"}</p>
        </div>
      </div>

      <div className="rounded-lg border border-gold/20 bg-gold/5 p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gold">
          <CheckCircle2 className="h-4 w-4" /> What happens after submission
        </h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>• We review your trip details and profile within 24 hours</li>
          <li>• We confirm the right visa category and full document checklist</li>
          <li>• You provide remaining documents — we prepare your application</li>
          <li>• We submit and track the application through to a decision</li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">No payment required at this stage. Fees will be confirmed after our review.</p>
      </div>

      {/* Summary */}
      <div className="rounded-lg border p-5">
        <h3 className="mb-3 text-sm font-bold">Application Summary</h3>
        <dl className="space-y-2 text-sm">
          {data.fullName && <div className="flex justify-between"><dt className="text-muted-foreground">Name</dt><dd className="font-medium">{data.fullName}</dd></div>}
          {data.email && <div className="flex justify-between"><dt className="text-muted-foreground">Email</dt><dd className="font-medium">{data.email}</dd></div>}
          {data.nationality && <div className="flex justify-between"><dt className="text-muted-foreground">Nationality</dt><dd className="font-medium">{data.nationality}</dd></div>}
          {data.passportNumber && <div className="flex justify-between"><dt className="text-muted-foreground">Passport</dt><dd className="font-medium">{data.passportNumber}</dd></div>}
          {data.destCountry && <div className="flex justify-between"><dt className="text-muted-foreground">Destination</dt><dd className="font-medium">{data.destCountry}</dd></div>}
          {data.duration && <div className="flex justify-between"><dt className="text-muted-foreground">Duration</dt><dd className="font-medium">{data.duration}</dd></div>}
        </dl>
      </div>

      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          id="visit-consent"
          className="mt-1"
          checked={confirmed}
          onChange={(e) => onConfirm(e.target.checked)}
        />
        <span className="text-xs text-muted-foreground">
          I confirm that the information provided is accurate and I consent to Global Link Migration Services processing my visit visa application. I understand that final decisions are made by embassies, consulates, and immigration authorities.
        </span>
      </label>
    </div>
  );
}
