import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FeeAcknowledgment } from "@/components/FeeAcknowledgment";
import {
  User, BookOpen, GraduationCap, DollarSign, FileText, Upload,
  Sparkles, ArrowLeft, ArrowRight, CheckCircle2, Shield, Clock,
  MapPin, Globe, Award,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/apply/study")({
  head: () => ({
    meta: [
      { title: "Study Visa Application — Global Link Migration Services" },
      { name: "description", content: "Complete your guided study visa application. We'll match you with programs based on your profile, budget, and goals." },
    ],
  }),
  component: StudyApplicationForm,
});

const STEPS = [
  { label: "Personal", icon: User },
  { label: "Education", icon: BookOpen },
  { label: "Preferences", icon: GraduationCap },
  { label: "Financial", icon: DollarSign },
  { label: "History", icon: FileText },
  { label: "Documents", icon: Upload },
  { label: "Matching", icon: Sparkles },
];

function StudyApplicationForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [feeConfirmed, setFeeConfirmed] = useState(false);
  const navigate = useNavigate();

  function update(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        application_type: "Study Visa" as any,
        destination_country: formData.destCountry || null,
        form_data: formData as any,
        reference_number: "",
      } as any).select("id, reference_number").single();
      if (error) throw error;
      setRefNumber(data?.reference_number || "");
      setApplicationId(data?.id || "");
      setSubmitted(true);
      toast.success("Application submitted!");

      if (user && data?.id) {
        setTimeout(() => {
          navigate({ to: "/payment/$applicationId", params: { applicationId: data.id } });
        }, 2000);
      }
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
              {applicationId ? "Redirecting you to complete payment..." : "We'll review your application and be in touch."}
            </p>
            {applicationId && (
              <div className="mt-4">
                <Link to="/payment/$applicationId" params={{ applicationId }}>
                  <Button variant="gold" size="lg">Proceed to Payment</Button>
                </Link>
              </div>
            )}
            <div className="mt-6 rounded-lg bg-muted/50 p-4 text-left text-sm">
              <h3 className="mb-2 font-semibold">What happens next?</h3>
              <ol className="space-y-1.5 text-muted-foreground">
                <li className="flex gap-2"><span className="font-bold text-gold">1.</span> Complete your payment to begin processing</li>
                <li className="flex gap-2"><span className="font-bold text-gold">2.</span> We review your education profile and preferences</li>
                <li className="flex gap-2"><span className="font-bold text-gold">3.</span> We match you with suitable programs and institutions</li>
                <li className="flex gap-2"><span className="font-bold text-gold">4.</span> You choose and we begin the application process</li>
              </ol>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/study"><Button variant="outline">Browse Programs</Button></Link>
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
            <h1 className="text-2xl font-bold md:text-3xl">Study Visa Application</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Step {step + 1} of {STEPS.length} · Estimated {7 - step} min remaining
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
                {step === 1 && <StepEducation data={formData} update={update} />}
                {step === 2 && <StepPreferences data={formData} update={update} />}
                {step === 3 && <StepFinancial data={formData} update={update} />}
                {step === 4 && <StepHistory data={formData} update={update} />}
                {step === 5 && <StepDocuments />}
                {step === 6 && (
                  <div className="space-y-6">
                    <StepMatching data={formData} />
                    <FeeAcknowledgment
                      amount={750}
                      currency="USD"
                      serviceLabel="Study Visa Application"
                      onConfirmChange={setFeeConfirmed}
                    />
                  </div>
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
                disabled={submitting || (step === STEPS.length - 1 && !feeConfirmed)}
                className="gap-1 bg-gold text-gold-foreground hover:bg-gold/90"
              >
                {step === STEPS.length - 1
                  ? (submitting ? "Submitting…" : !feeConfirmed ? "Confirm fee to continue" : "Submit Application")
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
      <p className="text-sm text-muted-foreground">Tell us about yourself so we can match you with the right programs.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Full Name *</Label><Input value={data.fullName || ""} onChange={(e) => update("fullName", e.target.value)} placeholder="Enter your full name" /></div>
        <div><Label>Date of Birth *</Label><Input type="date" value={data.dob || ""} onChange={(e) => update("dob", e.target.value)} /></div>
        <div><Label>Nationality *</Label><Input value={data.nationality || ""} onChange={(e) => update("nationality", e.target.value)} placeholder="e.g. Nigerian" /></div>
        <div><Label>Country of Residence *</Label><Input value={data.residence || ""} onChange={(e) => update("residence", e.target.value)} placeholder="e.g. Nigeria" /></div>
        <div><Label>Email *</Label><Input type="email" value={data.email || ""} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" /></div>
        <div><Label>Phone *</Label><Input type="tel" value={data.phone || ""} onChange={(e) => update("phone", e.target.value)} placeholder="+234..." /></div>
      </div>
    </div>
  );
}

function StepEducation({ data, update }: StepProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">Education Background</h2>
      <p className="text-sm text-muted-foreground">Your academic history helps us find programs that match your qualifications.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Highest Completed Level *</Label>
          <Select value={data.eduLevel || ""} onValueChange={(v) => update("eduLevel", v)}>
            <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="secondary">Secondary / High School</SelectItem>
              <SelectItem value="diploma">Diploma</SelectItem>
              <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
              <SelectItem value="master">Master's Degree</SelectItem>
              <SelectItem value="phd">PhD / Doctorate</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Current / Last School *</Label><Input value={data.school || ""} onChange={(e) => update("school", e.target.value)} placeholder="Institution name" /></div>
        <div><Label>Grades / GPA</Label><Input value={data.gpa || ""} onChange={(e) => update("gpa", e.target.value)} placeholder="e.g. 3.5/4.0 or Second Class Upper" /></div>
        <div><Label>Graduation Year</Label><Input value={data.gradYear || ""} onChange={(e) => update("gradYear", e.target.value)} placeholder="e.g. 2024" /></div>
        <div>
          <Label>English Proficiency *</Label>
          <Select value={data.englishLevel || ""} onValueChange={(v) => update("englishLevel", v)}>
            <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="native">Native Speaker</SelectItem>
              <SelectItem value="fluent">Fluent</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Test Scores (if available)</Label>
          <Input value={data.testScores || ""} onChange={(e) => update("testScores", e.target.value)} placeholder="e.g. IELTS 6.5, TOEFL 88" />
        </div>
      </div>
    </div>
  );
}

function StepPreferences({ data, update }: StepProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">Study Preferences</h2>
      <p className="text-sm text-muted-foreground">Tell us what you want to study and where — we'll use this for matching.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><Label>Course / Subject You Want to Study *</Label><Input value={data.course || ""} onChange={(e) => update("course", e.target.value)} placeholder="e.g. Computer Science, Nursing, Business" /></div>
        <div>
          <Label>Destination Country *</Label>
          <Select value={data.destCountry || ""} onValueChange={(v) => update("destCountry", v)}>
            <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="canada">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="australia">Australia</SelectItem>
              <SelectItem value="germany">Germany</SelectItem>
              <SelectItem value="ireland">Ireland</SelectItem>
              <SelectItem value="nz">New Zealand</SelectItem>
              <SelectItem value="open">Open to suggestions</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Preferred Intake</Label>
          <Select value={data.intake || ""} onValueChange={(v) => update("intake", v)}>
            <SelectTrigger><SelectValue placeholder="Select intake" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sep2026">September 2026</SelectItem>
              <SelectItem value="jan2027">January 2027</SelectItem>
              <SelectItem value="feb2027">February 2027</SelectItem>
              <SelectItem value="sep2027">September 2027</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Study Level *</Label>
          <Select value={data.studyLevel || ""} onValueChange={(v) => update("studyLevel", v)}>
            <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="certificate">Certificate</SelectItem>
              <SelectItem value="diploma">Diploma</SelectItem>
              <SelectItem value="undergraduate">Undergraduate</SelectItem>
              <SelectItem value="postgraduate">Postgraduate</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Preferred Institution Type</Label>
          <Select value={data.instType || ""} onValueChange={(v) => update("instType", v)}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="university">University</SelectItem>
              <SelectItem value="college">College / Polytechnic</SelectItem>
              <SelectItem value="tafe">TAFE / Vocational</SelectItem>
              <SelectItem value="any">No preference</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Preferred City / Region</Label><Input value={data.prefCity || ""} onChange={(e) => update("prefCity", e.target.value)} placeholder="e.g. Toronto, London, Melbourne" /></div>
        <div>
          <Label>Preferred Duration</Label>
          <Select value={data.duration || ""} onValueChange={(v) => update("duration", v)}>
            <SelectTrigger><SelectValue placeholder="Select duration" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1year">1 year or less</SelectItem>
              <SelectItem value="2years">2 years</SelectItem>
              <SelectItem value="3years">3 years</SelectItem>
              <SelectItem value="4years">4+ years</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function StepFinancial({ data, update }: StepProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">Financial Profile</h2>
      <p className="text-sm text-muted-foreground">This helps us recommend programs within your budget and identify funding options.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Tuition Budget Range *</Label>
          <Select value={data.tuitionBudget || ""} onValueChange={(v) => update("tuitionBudget", v)}>
            <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="under10k">Under $10,000/yr</SelectItem>
              <SelectItem value="10k-20k">$10,000–$20,000/yr</SelectItem>
              <SelectItem value="20k-35k">$20,000–$35,000/yr</SelectItem>
              <SelectItem value="35k-50k">$35,000–$50,000/yr</SelectItem>
              <SelectItem value="over50k">Over $50,000/yr</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Living Cost Budget</Label>
          <Select value={data.livingBudget || ""} onValueChange={(v) => update("livingBudget", v)}>
            <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="under800">Under $800/mo</SelectItem>
              <SelectItem value="800-1500">$800–$1,500/mo</SelectItem>
              <SelectItem value="1500-2500">$1,500–$2,500/mo</SelectItem>
              <SelectItem value="over2500">Over $2,500/mo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Funding Source *</Label>
          <Select value={data.fundingSource || ""} onValueChange={(v) => update("fundingSource", v)}>
            <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="self">Self-funded</SelectItem>
              <SelectItem value="family">Family sponsor</SelectItem>
              <SelectItem value="scholarship">Seeking scholarship</SelectItem>
              <SelectItem value="loan">Education loan</SelectItem>
              <SelectItem value="mixed">Mixed / combination</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Bank Statement Available?</Label>
          <Select value={data.bankStatement || ""} onValueChange={(v) => update("bankStatement", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes, ready to provide</SelectItem>
              <SelectItem value="soon">Will have within 1 month</SelectItem>
              <SelectItem value="no">Not yet available</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function StepHistory({ data, update }: StepProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">Visa & Application History</h2>
      <p className="text-sm text-muted-foreground">Previous applications help us assess your profile and advise accordingly.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Previous Study Visa Refusals?</Label>
          <Select value={data.prevRefusals || ""} onValueChange={(v) => update("prevRefusals", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No previous refusals</SelectItem>
              <SelectItem value="one">1 refusal</SelectItem>
              <SelectItem value="multiple">2 or more refusals</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Previous Applications Made?</Label>
          <Select value={data.prevApps || ""} onValueChange={(v) => update("prevApps", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No previous applications</SelectItem>
              <SelectItem value="applied">Applied but no offer</SelectItem>
              <SelectItem value="offer">Have existing offer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label>Existing Admissions / Offers (if any)</Label>
          <Textarea value={data.existingOffers || ""} onChange={(e) => update("existingOffers", e.target.value)} placeholder="Describe any current offers or admissions you hold…" rows={3} />
        </div>
      </div>
    </div>
  );
}

function StepDocuments() {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">Documents Upload</h2>
      <p className="text-sm text-muted-foreground">Upload your supporting documents. You can also upload these later from your dashboard.</p>
      <div className="grid gap-4">
        {[
          { label: "Passport (scan of bio page)", accept: ".pdf,.jpg,.png" },
          { label: "Academic Transcript", accept: ".pdf,.jpg,.png" },
          { label: "CV / Resume", accept: ".pdf,.doc,.docx" },
          { label: "Certificates & Diplomas", accept: ".pdf,.jpg,.png" },
          { label: "English Test Results (IELTS/TOEFL)", accept: ".pdf,.jpg,.png" },
          { label: "Motivation Letter / Personal Statement", accept: ".pdf,.doc,.docx" },
        ].map((doc) => (
          <div key={doc.label} className="rounded-lg border border-dashed p-4">
            <Label className="text-sm">{doc.label}</Label>
            <Input type="file" accept={doc.accept} className="mt-2" />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Accepted formats: PDF, JPG, PNG, DOC, DOCX. Max 10MB per file.</p>
    </div>
  );
}

function StepMatching({ data }: { data: Record<string, string> }) {
  const destMap: Record<string, string> = {
    canada: "Canada", uk: "United Kingdom", australia: "Australia",
    germany: "Germany", ireland: "Ireland", nz: "New Zealand", open: "Multiple Countries",
  };
  const levelMap: Record<string, string> = {
    certificate: "Certificate", diploma: "Diploma", undergraduate: "Undergraduate",
    postgraduate: "Postgraduate", phd: "PhD",
  };

  const matchedCountry = destMap[data.destCountry || ""] || "Suggested countries based on your profile";
  const matchedLevel = levelMap[data.studyLevel || ""] || "Based on your qualifications";
  const matchedCourse = data.course || "Based on your interests";

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Program Matching Preview</h2>
      <p className="text-sm text-muted-foreground">Based on your profile, here are our initial recommendations. Our team will provide detailed options after reviewing your full application.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border bg-muted/30 p-4">
          <Globe className="mb-2 h-5 w-5 text-gold" />
          <p className="text-xs font-medium text-muted-foreground">Suggested Destination</p>
          <p className="mt-0.5 font-bold">{matchedCountry}</p>
        </div>
        <div className="rounded-lg border bg-muted/30 p-4">
          <GraduationCap className="mb-2 h-5 w-5 text-gold" />
          <p className="text-xs font-medium text-muted-foreground">Study Level</p>
          <p className="mt-0.5 font-bold">{matchedLevel}</p>
        </div>
        <div className="rounded-lg border bg-muted/30 p-4">
          <BookOpen className="mb-2 h-5 w-5 text-gold" />
          <p className="text-xs font-medium text-muted-foreground">Course Category</p>
          <p className="mt-0.5 font-bold">{matchedCourse}</p>
        </div>
        <div className="rounded-lg border bg-muted/30 p-4">
          <Sparkles className="mb-2 h-5 w-5 text-gold" />
          <p className="text-xs font-medium text-muted-foreground">Next Step</p>
          <p className="mt-0.5 font-bold">Personalised program shortlist</p>
        </div>
      </div>

      <div className="rounded-lg border border-gold/20 bg-gold/5 p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gold">
          <CheckCircle2 className="h-4 w-4" /> What happens after submission
        </h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>• We review your profile and preferences within 24 hours</li>
          <li>• You receive a shortlist of matching programs and institutions</li>
          <li>• You choose your preferred options and we begin applications</li>
          <li>• We guide you through visa, documentation, and enrollment</li>
        </ul>
      </div>

      {/* Review summary */}
      <div className="rounded-lg border p-5">
        <h3 className="mb-3 text-sm font-bold">Application Summary</h3>
        <dl className="space-y-2 text-sm">
          {data.fullName && <div className="flex justify-between"><dt className="text-muted-foreground">Name</dt><dd className="font-medium">{data.fullName}</dd></div>}
          {data.email && <div className="flex justify-between"><dt className="text-muted-foreground">Email</dt><dd className="font-medium">{data.email}</dd></div>}
          {data.nationality && <div className="flex justify-between"><dt className="text-muted-foreground">Nationality</dt><dd className="font-medium">{data.nationality}</dd></div>}
          {data.eduLevel && <div className="flex justify-between"><dt className="text-muted-foreground">Education</dt><dd className="font-medium capitalize">{data.eduLevel}</dd></div>}
          {data.course && <div className="flex justify-between"><dt className="text-muted-foreground">Desired Course</dt><dd className="font-medium">{data.course}</dd></div>}
          {data.destCountry && <div className="flex justify-between"><dt className="text-muted-foreground">Destination</dt><dd className="font-medium">{matchedCountry}</dd></div>}
          {data.studyLevel && <div className="flex justify-between"><dt className="text-muted-foreground">Level</dt><dd className="font-medium capitalize">{data.studyLevel}</dd></div>}
          {data.tuitionBudget && <div className="flex justify-between"><dt className="text-muted-foreground">Tuition Budget</dt><dd className="font-medium">{data.tuitionBudget}</dd></div>}
        </dl>
      </div>

      <div className="flex items-start gap-2">
        <input type="checkbox" id="consent" className="mt-1" />
        <label htmlFor="consent" className="text-xs text-muted-foreground">
          I confirm that the information provided is accurate and I consent to Global Link Migration Services processing my application. I understand that final admissions and visa decisions are made by institutions and immigration authorities.
        </label>
      </div>
    </div>
  );
}
