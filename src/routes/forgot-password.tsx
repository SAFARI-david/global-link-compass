import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Globe, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{ title: "Forgot Password — Global Link Migration Services" }],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="section-padding">
        <div className="container-narrow flex justify-center">
          <motion.div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-gold" />
            <h1 className="text-2xl font-bold">Check Your Email</h1>
            <p className="mt-3 text-sm text-muted-foreground">If an account exists for <strong>{email}</strong>, you'll receive a password reset link.</p>
            <Link to="/login" search={{ redirect: "" }}><Button className="mt-6" variant="outline">Back to Sign In</Button></Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-narrow flex justify-center">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold"><Globe className="h-6 w-6 text-gold-foreground" /></div>
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-sm text-muted-foreground">Enter your email and we'll send a reset link</p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
              <div>
                <Label>Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="email" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gold text-gold-foreground hover:bg-gold/90" disabled={loading}>
                {loading ? "Sending…" : "Send Reset Link"} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link to="/login" search={{ redirect: "" }} className="font-semibold text-primary hover:underline">Back to Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
