import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, ArrowLeft, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Answers = {
  destination?: string;
  visaType?: string;
  education?: string;
  experience?: string;
  name?: string;
  email?: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUESTIONS = [
  {
    key: "destination" as const,
    label: "Where do you want to go?",
    options: ["Canada", "United Kingdom", "Australia", "Germany", "UAE", "Other"],
  },
  {
    key: "visaType" as const,
    label: "Which type of visa do you need?",
    options: ["Work Visa", "Study Visa", "Visit Visa", "Job Placement", "Not Sure"],
  },
  {
    key: "education" as const,
    label: "What is your highest level of education?",
    options: ["High School", "Diploma / Certificate", "Bachelor's Degree", "Master's or PhD"],
  },
  {
    key: "experience" as const,
    label: "How many years of work experience do you have?",
    options: ["0–2 years", "3–5 years", "5–10 years", "10+ years"],
  },
];

export function EligibilityCheck({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const totalSteps = QUESTIONS.length + 1; // +1 for contact step
  const progress = ((step + 1) / totalSteps) * 100;
  const currentQ = QUESTIONS[step];
  const isContactStep = step === QUESTIONS.length;

  function selectAnswer(value: string) {
    if (!currentQ) return;
    setAnswers((a) => ({ ...a, [currentQ.key]: value }));
    setTimeout(() => setStep((s) => Math.min(s + 1, totalSteps - 1)), 200);
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setName("");
    setEmail("");
    setShowResult(false);
  }

  async function submit() {
    if (!name.trim() || !email.trim() || submitting) return;
    setSubmitting(true);

    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();

    const { error } = await supabase.from("leads").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      source: "eligibility-check",
      interest: answers.visaType?.toLowerCase().includes("study") ? "study" : "work",
      country: answers.destination,
      status: "new",
      form_data: {
        ...answers,
        eligibility_result: "qualified",
      },
      utm_source: params.get("utm_source") || null,
      utm_medium: params.get("utm_medium") || null,
      utm_campaign: params.get("utm_campaign") || null,
    } as any);

    setSubmitting(false);

    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    setShowResult(true);
  }

  function handleStart() {
    onOpenChange(false);
    const target = answers.visaType?.toLowerCase().includes("study") ? "/apply/study" : "/apply/work-visa";
    navigate({ to: target });
  }

  function handleClose(o: boolean) {
    onOpenChange(o);
    if (!o) setTimeout(reset, 300);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Eligibility Check</DialogTitle>
        <DialogDescription className="sr-only">Answer a few quick questions to see which visa programs you qualify for.</DialogDescription>

        {/* Progress bar */}
        {!showResult && (
          <div className="h-1 w-full bg-muted">
            <motion.div
              className="h-full bg-gold"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          {showResult ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-9 w-9 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">You likely qualify ✓</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Based on your answers, you're a good fit for our{" "}
                <strong className="text-foreground">{answers.destination} {answers.visaType}</strong> program.
                A specialist will reach out within 24 hours with your next steps.
              </p>

              <div className="mt-5 rounded-lg border border-gold/20 bg-gold/5 p-4 text-left">
                <p className="text-xs font-bold uppercase tracking-wide text-gold">What's next?</p>
                <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex gap-2"><span className="text-gold">→</span> Complete your full application</li>
                  <li className="flex gap-2"><span className="text-gold">→</span> Receive your personalised document checklist</li>
                  <li className="flex gap-2"><span className="text-gold">→</span> Speak with a dedicated case officer</li>
                </ul>
              </div>

              <Button variant="gold" size="lg" className="mt-5 w-full gap-2" onClick={handleStart}>
                Start Your Application <ArrowRight className="h-4 w-4" />
              </Button>
              <button
                type="button"
                onClick={() => handleClose(false)}
                className="mt-3 text-xs text-muted-foreground hover:text-foreground"
              >
                I'll come back later
              </button>
            </motion.div>
          ) : isContactStep ? (
            <AnimatePresence mode="wait">
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <p className="text-xs font-bold uppercase tracking-wide text-gold">Last step</p>
                <h3 className="mt-1 text-lg font-bold">Where should we send your result?</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  We'll save your answers so you can pick up where you left off.
                </p>

                <div className="mt-5 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Full name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Email address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      maxLength={150}
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <Button variant="outline" size="default" onClick={back} className="gap-1">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button
                    variant="gold"
                    size="default"
                    onClick={submit}
                    disabled={!name.trim() || !email.trim() || submitting}
                    className="flex-1 gap-1"
                  >
                    {submitting ? "Checking…" : (<>See My Result <Sparkles className="h-4 w-4" /></>)}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <p className="text-xs font-bold uppercase tracking-wide text-gold">
                  Step {step + 1} of {totalSteps}
                </p>
                <h3 className="mt-1 text-lg font-bold">{currentQ.label}</h3>

                <div className="mt-5 space-y-2">
                  {currentQ.options.map((opt) => {
                    const selected = answers[currentQ.key] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => selectAnswer(opt)}
                        className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all ${
                          selected
                            ? "border-gold bg-gold/10 text-foreground"
                            : "border-border bg-card hover:border-gold/40 hover:bg-muted/50"
                        }`}
                      >
                        <span>{opt}</span>
                        {selected && <CheckCircle2 className="h-4 w-4 text-gold" />}
                      </button>
                    );
                  })}
                </div>

                {step > 0 && (
                  <button
                    type="button"
                    onClick={back}
                    className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-3 w-3" /> Back
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
