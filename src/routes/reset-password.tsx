import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Globe, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Set New Password — Global Link Migration Services" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Check for recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // Also check hash for type=recovery
    if (typeof window !== "undefined" && window.location.hash.includes("type=recovery")) {
      setReady(true);
    }
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="section-padding">
        <div className="container-narrow flex justify-center">
          <motion.div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-gold" />
            <h1 className="text-2xl font-bold">Password Updated</h1>
            <p className="mt-3 text-sm text-muted-foreground">Your password has been reset successfully.</p>
            <Link to="/login"><Button className="mt-6 bg-gold text-gold-foreground hover:bg-gold/90">Sign In</Button></Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="section-padding">
        <div className="container-narrow flex justify-center">
          <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold">Invalid or Expired Link</h1>
            <p className="mt-2 text-sm text-muted-foreground">This password reset link may have expired. Please request a new one.</p>
            <Link to="/forgot-password"><Button className="mt-6" variant="outline">Request New Link</Button></Link>
          </div>
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
            <h1 className="text-2xl font-bold">Set New Password</h1>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
              <div>
                <Label>New Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type={showPassword ? "text" : "password"} className="pl-10 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-gold text-gold-foreground hover:bg-gold/90" disabled={loading}>
                {loading ? "Updating…" : "Update Password"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
