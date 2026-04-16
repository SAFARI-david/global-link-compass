import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  User, Plane, GraduationCap, Briefcase, Languages,
  MapPin, Users, FileText, CheckCircle, Shield,
  Clock, ArrowLeft, ArrowRight, Check, Info, CreditCard,
  Lightbulb, HelpCircle
} from "lucide-react";

const STEPS = [
  { label: "Personal Info", icon: User },
  { label: "Passport & Travel", icon: Plane },
  { label: "Education", icon: GraduationCap },
  { label: "Work Experience", icon: Briefcase },
  { label: "Language", icon: Languages },
  { label: "Job Preference", icon: MapPin },
  { label: "Dependants", icon: Users },
  { label: "Documents", icon: FileText },
  { label: "Review & Submit", icon: CheckCircle },
];

const STEP_TIPS: Record<number, { title: string; tip: string; why: string }> = {
  0: { title: "Why we need this", tip: "Basic details help us verify your identity and determine which visa programs you're eligible for.", why: "This information is required by all immigration authorities." },
  1: { title: "Why this matters", tip: "Your passport validity and travel history directly affect visa eligibility and processing speed.", why: "A valid passport (6+ months) is mandatory for all visa types." },
  2: { title: "How we use this", tip: "Your education level determines which skilled worker programs and visa categories you qualify for.", why: "Higher qualifications often unlock faster processing streams." },
  3: { title: "What we're looking for", tip: "Work experience helps us match you with the right employer and visa program.", why: "Even 1 year of relevant experience can significantly improve your chances." },
  4: { title: "Language requirements", tip: "Most countries require proof of language ability. We'll guide you on which test to take if needed.", why: "Don't worry if you haven't taken a test yet — we'll advise you." },
  5: { title: "Your preferences", tip: "Tell us where and what type of work you're interested in. We'll match you with real opportunities.", why: "Being open to multiple options increases your chances significantly." },
  6: { title: "Family applications", tip: "If you're bringing family, we include them in the same application to keep costs down.", why: "Dependent visas are processed alongside your main application." },
  7: { title: "Document upload", tip: "Upload what you have now. You can add more documents later — nothing is finalized yet.", why: "We'll send you a complete checklist after reviewing your profile." },
  8: { title: "Almost done!", tip: "Review your information and submit. This is a free submission — no payment at this stage.", why: "You'll receive a detailed plan and fee breakdown before any payment." },
};

function InputField({ label, placeholder, type = "text", required = true, helpText }: {
  label: string; placeholder?: string; type?: string; required?: boolean; helpText?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
    </div>
  );
}

function SelectField({ label, options, required = true, helpText }: {
  label: string; options: string[]; required?: boolean; helpText?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <select className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20">
        <option value="">Select...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
    </div>
  );
}

function RadioField({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex flex-wrap gap-3">
        {options.map((o) => (
          <label key={o} className="flex items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm cursor-pointer hover:border-primary/30 transition-colors">
            <input type="radio" name={label} className="accent-primary" />
            {o}
          </label>
        ))}
      </div>
    </div>
  );
}

function FileUpload({ label, helpText }: { label: string; helpText?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-input bg-muted/30 p-6 text-center transition-colors hover:border-primary/30">
        <div>
          <FileText className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-2 text-xs text-muted-foreground">
            Click to upload or drag and drop
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground/60">PDF, JPG, PNG up to 10MB</p>
        </div>
      </div>
      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
    </div>
  );
}

function StepContextTip({ step }: { step: number }) {
  const tip = STEP_TIPS[step];
  if (!tip) return null;
  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/10 bg-primary/5 p-4">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <p className="text-xs font-semibold text-foreground">{tip.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{tip.tip}</p>
        <p className="mt-1 text-[10px] text-gold">{tip.why}</p>
      </div>
    </div>
  );
}

function StepContent({ step }: { step: number }) {
  switch (step) {
    case 0:
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          <InputField label="Full Name" placeholder="Enter your full name" />
          <InputField label="Date of Birth" type="date" />
          <SelectField label="Gender" options={["Male", "Female", "Other"]} />
          <SelectField label="Nationality" options={["Nigerian", "Indian", "Pakistani", "Filipino", "Bangladeshi", "Other"]} />
          <SelectField label="Country of Residence" options={["Nigeria", "India", "Pakistan", "Philippines", "Bangladesh", "Other"]} />
          <SelectField label="Marital Status" options={["Single", "Married", "Divorced", "Widowed"]} />
          <InputField label="Email Address" type="email" placeholder="your@email.com" />
          <InputField label="Phone Number" type="tel" placeholder="+1 234 567 890" />
          <SelectField label="Preferred Communication" options={["Email", "Phone", "Live Chat", "Dashboard Messages"]} />
        </div>
      );
    case 1:
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          <RadioField label="Do you have a valid passport?" options={["Yes", "No"]} />
          <InputField label="Passport Expiry Date" type="date" helpText="Must be valid for at least 6 months" />
          <div className="sm:col-span-2">
            <SelectField label="Previous Travel History" options={["No previous travel", "1-3 countries", "4-10 countries", "10+ countries"]} />
          </div>
          <RadioField label="Previous Visa Refusals?" options={["Yes", "No"]} />
          <InputField label="Countries Previously Visited" placeholder="e.g. USA, UK, Canada" required={false} helpText="Comma-separated list" />
        </div>
      );
    case 2:
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField label="Highest Education Level" options={["High School", "Diploma", "Bachelor's", "Master's", "PhD", "Vocational/Trade"]} />
          <InputField label="Field of Study" placeholder="e.g. Computer Science, Nursing" />
          <InputField label="Institution Name" placeholder="University or college name" />
          <InputField label="Graduation Year" type="number" placeholder="e.g. 2020" />
        </div>
      );
    case 3:
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          <InputField label="Current Occupation" placeholder="e.g. Software Developer" />
          <SelectField label="Years of Experience" options={["0-1 years", "2-3 years", "4-5 years", "6-10 years", "10+ years"]} />
          <SelectField label="Industry" options={["Technology", "Healthcare", "Construction", "Agriculture", "Hospitality", "Manufacturing", "Education", "Finance", "Other"]} />
          <InputField label="Current Employer" placeholder="Company name" required={false} />
          <div className="sm:col-span-2">
            <InputField label="Previous Job Titles" placeholder="e.g. Junior Developer, Senior Analyst" helpText="Comma-separated" />
          </div>
          <div className="sm:col-span-2">
            <FileUpload label="Upload CV / Resume" helpText="Your most recent CV or resume" />
          </div>
        </div>
      );
    case 4:
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField label="English Proficiency" options={["Beginner", "Intermediate", "Advanced", "Fluent", "Native"]} />
          <SelectField label="French Proficiency" options={["None", "Beginner", "Intermediate", "Advanced", "Fluent", "Native"]} />
          <SelectField label="Language Test Taken" options={["None", "IELTS", "TOEFL", "TEF", "TCF", "PTE", "CELPIP", "Other"]} />
          <InputField label="Overall Score" placeholder="e.g. 7.0" required={false} helpText="Enter your overall band score if applicable" />
        </div>
      );
    case 5:
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField label="Destination Country" options={["Canada", "United Kingdom", "Australia", "Germany", "United States", "Other"]} />
          <SelectField label="Preferred Work Visa Program" options={["LMIA (Canada)", "Skilled Worker", "Seasonal Worker", "Employer Sponsored", "Other"]} />
          <InputField label="Preferred Occupation" placeholder="e.g. Farm Worker, Nurse" />
          <SelectField label="Preferred Job Category" options={["Skilled", "Semi-skilled", "Unskilled", "Professional", "Trade"]} />
          <InputField label="Salary Expectation" placeholder="e.g. $20/hr or $50,000/yr" required={false} />
          <RadioField label="Open to Unskilled Jobs?" options={["Yes", "No"]} />
          <RadioField label="Ready to Relocate Immediately?" options={["Yes", "No"]} />
        </div>
      );
    case 6:
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          <RadioField label="Applying Alone or With Family?" options={["Alone", "With Spouse", "With Family"]} />
          <SelectField label="Number of Dependants" options={["0", "1", "2", "3", "4", "5+"]} />
        </div>
      );
    case 7:
      return (
        <div className="grid gap-5">
          <FileUpload label="Passport Copy" helpText="Clear scan of your passport bio page" />
          <FileUpload label="CV / Resume" />
          <FileUpload label="Education Certificates" helpText="Degree, diploma, or transcript" />
          <FileUpload label="Language Test Certificate" helpText="IELTS, TOEFL, TEF, etc." />
          <FileUpload label="Other Supporting Documents" helpText="Any additional documents relevant to your application" />
        </div>
      );
    case 8:
      return (
        <div className="flex flex-col gap-6">
          {/* Payment confidence */}
          <div className="rounded-xl border border-gold/20 bg-gold/5 p-5">
            <div className="flex items-start gap-3">
              <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <h4 className="text-sm font-bold">About Payment</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">This submission is completely free.</strong> After we review your profile, 
                  you'll receive a detailed service plan with a transparent fee breakdown. 
                  No payment is taken until you review and approve the plan. You can cancel at any time before processing begins.
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-gold" /> No hidden fees</span>
                  <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-gold" /> Full refund if not processed</span>
                  <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-gold" /> Secure payment methods</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-6">
            <h3 className="text-base font-bold">Application Summary</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Please review all sections before submitting. You can go back to any step to make changes.
            </p>
            <div className="mt-4 grid gap-3">
              {STEPS.slice(0, -1).map((s, i) => (
                <div key={s.label} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-gold" />
                    <span className="text-sm font-medium">{s.label}</span>
                  </div>
                  <span className="text-xs text-primary cursor-pointer hover:underline">Edit</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 accent-primary" />
              <span className="text-sm leading-relaxed text-foreground">
                I declare that the information provided is true and accurate. I understand that providing false information may result in application rejection. I consent to Global Link Migration Services processing my data for the purpose of visa application support.
              </span>
            </label>
          </div>

          {/* What happens next */}
          <div className="rounded-xl border border-primary/10 bg-primary/5 p-5">
            <h4 className="flex items-center gap-2 text-sm font-bold">
              <Info className="h-4 w-4 text-primary" /> What happens after you submit
            </h4>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">1</span>
                <span>You receive a <strong className="text-foreground">confirmation email</strong> immediately</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">2</span>
                <span>Our team reviews your profile within <strong className="text-foreground">24 hours</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">3</span>
                <span>You receive a <strong className="text-foreground">personalized plan</strong> with document checklist and fees</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">4</span>
                <span>Processing begins <strong className="text-foreground">only after you approve</strong> the plan and fee</span>
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export function WorkVisaForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="section-padding">
        <div className="container-narrow">
          <motion.div
            className="mx-auto max-w-lg text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
              <CheckCircle className="h-10 w-10 text-gold" />
            </div>
            <h1 className="mt-6 text-2xl font-bold md:text-3xl">Application Submitted!</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Thank you for submitting your work visa application. <strong className="text-foreground">No payment has been taken.</strong>
            </p>

            {/* What happens next - detailed */}
            <div className="mt-6 rounded-xl border border-border bg-muted/30 p-5 text-left">
              <h3 className="text-sm font-bold">Here's exactly what happens next:</h3>
              <ol className="mt-3 flex flex-col gap-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
                  <div>
                    <span className="font-medium">Confirmation email sent</span>
                    <p className="text-xs text-muted-foreground">Check your inbox for your application reference number</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
                  <div>
                    <span className="font-medium">Profile review (within 24 hours)</span>
                    <p className="text-xs text-muted-foreground">Our specialist reviews your eligibility and documents</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
                  <div>
                    <span className="font-medium">Personalized plan sent to you</span>
                    <p className="text-xs text-muted-foreground">Document checklist + transparent fee breakdown</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">4</span>
                  <div>
                    <span className="font-medium">You decide to proceed</span>
                    <p className="text-xs text-muted-foreground">Payment only after you approve the plan. Cancel anytime.</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="mt-6 rounded-lg border border-gold/20 bg-gold/5 p-4 text-sm text-muted-foreground">
              <Shield className="mx-auto h-5 w-5 text-gold" />
              <p className="mt-2">
                Your data is securely stored and only used for your visa application. 
                We never share your information with third parties.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Link to="/">
                <Button variant="default" size="lg">Go to Homepage</Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="lg">Browse Jobs</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-narrow">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold md:text-3xl">Work Visa Application</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete the guided form below. <strong className="text-foreground">This submission is free</strong> — we only discuss fees after reviewing your profile.
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> ~15 minutes</span>
              <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-gold" /> Data encrypted</span>
              <span className="flex items-center gap-1"><CreditCard className="h-3.5 w-3.5 text-gold" /> No payment now</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Step {currentStep + 1} of {STEPS.length}</span>
              <span>{Math.round(((currentStep + 1) / STEPS.length) * 100)}% complete</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-gold"
                initial={false}
                animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step indicators - desktop */}
          <div className="mb-8 hidden overflow-x-auto md:flex">
            <div className="flex w-full items-center justify-between gap-1">
              {STEPS.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => setCurrentStep(i)}
                  className={`flex flex-col items-center gap-1.5 text-center transition-colors ${
                    i === currentStep
                      ? "text-foreground"
                      : i < currentStep
                        ? "text-gold"
                        : "text-muted-foreground/40"
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    i === currentStep
                      ? "bg-primary text-primary-foreground"
                      : i < currentStep
                        ? "bg-gold/20 text-gold"
                        : "bg-muted text-muted-foreground/40"
                  }`}>
                    {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className="text-[10px] font-medium leading-tight max-w-[70px]">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current step label - mobile */}
          <div className="mb-6 flex items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {currentStep + 1}
            </div>
            <span className="text-sm font-bold">{STEPS[currentStep].label}</span>
          </div>

          {/* Form content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8"
            >
              <StepContextTip step={currentStep} />
              <StepContent step={currentStep} />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button
                variant="gold"
                size="lg"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Continue <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="gold"
                size="lg"
                onClick={() => setSubmitted(true)}
              >
                Submit Application <CheckCircle className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Trust footer */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-gold" /> Encrypted & secure</span>
            <span>·</span>
            <span>Response within 24 hours</span>
            <span>·</span>
            <span>No payment at this stage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
