import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CheckCircle2,
  Shield,
  Clock,
  ArrowRight,
  Globe,
  Star,
  Briefcase,
  GraduationCap,
  Users,
} from "lucide-react";

interface LandingPageProps {
  variant: "canada-work" | "study" | "jobs";
}

const CONFIG = {
  "canada-work": {
    badge: "Canada Work Visa Programs",
    headline: "Work in Canada",
    headlineAccent: "Start Your New Career",
    subtext: "Get matched with the right Canadian work visa program. Answer 4 quick questions and we'll guide you to the best option.",
    icon: Briefcase,
    color: "text-red-500",
    bgAccent: "from-red-600/20 to-primary/20",
    trustPoints: [
      "LMIA, Express Entry & Francophone programs",
      "Average processing: 8–16 weeks",
      "Structured and transparent process",
    ],
    formFields: [
      { id: "job_offer", label: "Do you have a job offer from a Canadian employer?", type: "radio", options: ["Yes", "No"] },
      { id: "french", label: "Do you speak French?", type: "radio", options: ["Yes — fluent", "Basic level", "No"] },
      { id: "experience", label: "Years of work experience", type: "select", options: ["Less than 1 year", "1–3 years", "3–5 years", "5+ years"] },
      { id: "goal", label: "What is your main goal?", type: "radio", options: ["Temporary work permit", "Permanent residence", "Not sure yet"] },
    ],
    redirectTo: "/apply/work-visa",
  },
  study: {
    badge: "Study Abroad Programs",
    headline: "Study Abroad",
    headlineAccent: "World-Class Education",
    subtext: "Find the perfect study program and country. Answer a few questions and get matched with programs that fit your budget and goals.",
    icon: GraduationCap,
    color: "text-blue-500",
    bgAccent: "from-blue-600/20 to-primary/20",
    trustPoints: [
      "UK, Canada, Australia & more",
      "Scholarship & financial aid guidance",
      "Work-while-you-study options",
    ],
    formFields: [
      { id: "country", label: "Preferred country", type: "select", options: ["United Kingdom", "Canada", "Australia", "Germany", "Not sure yet"] },
      { id: "level", label: "Level of study", type: "select", options: ["Undergraduate / Bachelor", "Postgraduate / Masters", "PhD / Doctorate", "Diploma / Certificate"] },
      { id: "field", label: "Field of study", type: "select", options: ["Business & Management", "Engineering & Technology", "Health & Medicine", "Arts & Humanities", "Science", "Other"] },
      { id: "budget", label: "Annual tuition budget", type: "select", options: ["Under $5,000", "$5,000 – $15,000", "$15,000 – $30,000", "Over $30,000", "Need scholarship"] },
    ],
    redirectTo: "/apply/study",
  },
  jobs: {
    badge: "Visa-Sponsored Jobs",
    headline: "Find a Job Abroad",
    headlineAccent: "With Visa Sponsorship",
    subtext: "Browse thousands of visa-sponsored jobs. Tell us what you're looking for and get matched with opportunities that fit.",
    icon: Users,
    color: "text-emerald-500",
    bgAccent: "from-emerald-600/20 to-primary/20",
    trustPoints: [
      "Jobs in Canada, UK, UAE, Australia & more",
      "Employer-sponsored visa support",
      "New listings added daily",
    ],
    formFields: [
      { id: "country", label: "Where do you want to work?", type: "select", options: ["Canada", "United Kingdom", "UAE", "Australia", "Germany", "Anywhere"] },
      { id: "field", label: "Your profession / industry", type: "select", options: ["IT & Software", "Healthcare & Nursing", "Engineering", "Hospitality", "Finance", "Construction", "Other"] },
      { id: "experience", label: "Years of experience", type: "select", options: ["Entry level (0–1)", "Junior (1–3)", "Mid-level (3–5)", "Senior (5+)"] },
      { id: "timeline", label: "How soon do you want to start?", type: "radio", options: ["Immediately", "Within 3 months", "Within 6 months", "Just exploring"] },
    ],
    redirectTo: "/jobs",
  },
};

export function LandingPage({ variant }: LandingPageProps) {
  const config = CONFIG[variant];
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const Icon = config.icon;

  const allFieldsFilled =
    name.trim() !== "" &&
    email.trim() !== "" &&
    config.formFields.every((f) => formData[f.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allFieldsFilled) return;
    setSubmitted(true);

    const params = new URLSearchParams(window.location.search);
    const interestMap: Record<string, string> = { "canada-work": "work", study: "study", jobs: "jobs" };

    // Save lead and get ID for linking
    const { data: leadRow, error } = await supabase.from("leads").insert({
      name: name.trim(),
      email: email.trim(),
      source: variant,
      interest: interestMap[variant] || variant,
      country: formData.country || null,
      status: "new",
      form_data: formData,
      utm_source: params.get("utm_source") || null,
      utm_medium: params.get("utm_medium") || null,
      utm_campaign: params.get("utm_campaign") || null,
    } as any).select("id").single();

    if (error) console.error("Failed to save lead:", error);

    const leadId = leadRow?.id;

    setTimeout(() => {
      navigate({ to: config.redirectTo as any, search: leadId ? { lead: leadId } : undefined } as any);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank you, {name}!</h2>
          <p className="text-muted-foreground mb-4">
            Based on your answers, we're taking you to the best next step. Redirecting now…
          </p>
          <div className="h-1 w-32 mx-auto rounded-full bg-primary/20 overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Globe className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold">Global Link</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">← Back to site</Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16 max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Left — Value prop */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
                <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                {config.badge}
              </div>

              <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
                {config.headline}{" "}
                <span className="text-gradient-gold">{config.headlineAccent}</span>
              </h1>

              <p className="mt-4 text-base text-muted-foreground md:text-lg leading-relaxed">
                {config.subtext}
              </p>

              <div className="mt-8 space-y-3">
                {config.trustPoints.map((point, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-sm font-medium">{point}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>Takes 30 seconds</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="shadow-xl border-2">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-lg font-bold mb-1">Begin Your Application</h2>
                <p className="text-sm text-muted-foreground mb-6">Answer a few questions to get started</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name & Email */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-1" required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="mt-1" required />
                    </div>
                  </div>

                  {/* Dynamic fields */}
                  {config.formFields.map((field) => (
                    <div key={field.id}>
                      <Label>{field.label}</Label>
                      {field.type === "radio" ? (
                        <RadioGroup
                          value={formData[field.id] || ""}
                          onValueChange={(v) => setFormData((p) => ({ ...p, [field.id]: v }))}
                          className="mt-2 flex flex-wrap gap-2"
                        >
                          {field.options.map((opt) => (
                            <label
                              key={opt}
                              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                                formData[field.id] === opt ? "border-primary bg-primary/5 font-medium" : "hover:bg-muted/50"
                              }`}
                            >
                              <RadioGroupItem value={opt} className="sr-only" />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </RadioGroup>
                      ) : (
                        <Select value={formData[field.id] || ""} onValueChange={(v) => setFormData((p) => ({ ...p, [field.id]: v }))}>
                          <SelectTrigger className="mt-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                          <SelectContent>
                            {field.options.map((opt) => (
                              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}

                  <Button type="submit" size="lg" className="w-full" disabled={!allFieldsFilled}>
                    Start Your Application <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Your data is kept private. Service fees apply — see pricing details.
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
