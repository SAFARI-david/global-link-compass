import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowRight, CheckCircle2, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface LeadCaptureFormProps {
  /** Visual variant */
  variant?: "default" | "dark" | "compact";
  /** Where to redirect after capture. Defaults to the guide page for the interest. */
  redirectTo?: string;
  /** Source identifier for analytics */
  source?: string;
}

const INTERESTS = [
  { value: "work", label: "Work Visa", redirect: "/guide/work" },
  { value: "study", label: "Study Visa", redirect: "/guide/study" },
  { value: "jobs", label: "Find a Job Abroad", redirect: "/jobs" },
];

const COUNTRIES = [
  "Canada", "United Kingdom", "Australia", "Germany", "UAE", "Other",
];

export function LeadCaptureForm({ variant = "default", redirectTo, source = "homepage" }: LeadCaptureFormProps) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [country, setCountry] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isValid = name.trim().length >= 2 && email.includes("@") && interest && country;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);

    const params = new URLSearchParams(window.location.search);

    const { data, error } = await supabase.from("leads").insert({
      name: name.trim(),
      email: email.trim(),
      source,
      interest,
      country: country === "Other" ? null : country,
      status: "new",
      form_data: { interest, country },
      utm_source: params.get("utm_source") || null,
      utm_medium: params.get("utm_medium") || null,
      utm_campaign: params.get("utm_campaign") || null,
    } as any).select("id").single();

    if (error) {
      console.error("Lead save error:", error);
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    const leadId = data?.id;
    const destination = redirectTo || INTERESTS.find((i) => i.value === interest)?.redirect || "/services";

    // Navigate with lead ID so the next page can link it
    navigate({ to: destination as any, search: leadId ? { lead: leadId } : undefined } as any);
  }

  const isDark = variant === "dark";
  const isCompact = variant === "compact";

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${isCompact ? "" : "rounded-xl border bg-card p-6 shadow-lg"} ${isDark ? "border-primary-foreground/10 bg-primary-foreground/5" : ""}`}>
      {!isCompact && (
        <div className="mb-1">
          <h3 className={`flex items-center gap-2 text-base font-bold ${isDark ? "text-primary-foreground" : ""}`}>
            <Sparkles className="h-4 w-4 text-gold" /> Start Your Application
          </h3>
          <p className={`mt-0.5 text-xs ${isDark ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
            Tell us what you're looking for — takes 30 seconds
          </p>
        </div>
      )}

      <div className={`grid gap-3 ${isCompact ? "sm:grid-cols-4" : "sm:grid-cols-2"}`}>
        <div>
          <Label className={`text-xs ${isDark ? "text-primary-foreground/70" : ""}`}>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={`mt-1 ${isDark ? "border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/30" : ""}`}
            required
            maxLength={100}
          />
        </div>
        <div>
          <Label className={`text-xs ${isDark ? "text-primary-foreground/70" : ""}`}>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className={`mt-1 ${isDark ? "border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/30" : ""}`}
            required
            maxLength={255}
          />
        </div>
        <div>
          <Label className={`text-xs ${isDark ? "text-primary-foreground/70" : ""}`}>I'm interested in</Label>
          <Select value={interest} onValueChange={setInterest}>
            <SelectTrigger className={`mt-1 ${isDark ? "border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground" : ""}`}>
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              {INTERESTS.map((i) => (
                <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className={`text-xs ${isDark ? "text-primary-foreground/70" : ""}`}>Country</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className={`mt-1 ${isDark ? "border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground" : ""}`}>
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={isCompact ? "flex items-end gap-3" : ""}>
        <Button
          type="submit"
          size={isCompact ? "default" : "lg"}
          variant={isDark ? "heroGold" : "default"}
          className={isCompact ? "shrink-0" : "w-full"}
          disabled={!isValid || submitting}
        >
          {submitting ? "Saving…" : (
            <>{isCompact ? "Go" : "Begin Application"} <ArrowRight className="ml-1 h-4 w-4" /></>
          )}
        </Button>
      </div>

      {!isCompact && (
        <div className={`flex items-center justify-center gap-4 text-[11px] ${isDark ? "text-primary-foreground/40" : "text-muted-foreground"}`}>
          <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Private & secure</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Service fees apply separately</span>
        </div>
      )}
    </form>
  );
}
