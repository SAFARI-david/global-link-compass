import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Globe, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth, type AppRole } from "@/hooks/use-auth";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { getRoleHomePath } from "@/lib/role-redirect";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Sign In — Global Link Migration Services" },
      { name: "description", content: "Sign in to your Global Link Migration Services account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, user, roles, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { redirect: redirectTo } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Auto-redirect already-signed-in users to their role home
  useEffect(() => {
    if (!authLoading && user) {
      const dest = redirectTo || getRoleHomePath(roles);
      navigate({ to: dest });
    }
  }, [authLoading, user, roles, redirectTo, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // Fetch roles immediately so we can route to the right dashboard
    // without waiting for the AuthProvider state to propagate.
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user.id;
    let userRoles: AppRole[] = [];
    if (uid) {
      const { data: roleRows } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid);
      userRoles = (roleRows ?? []).map((r) => r.role as AppRole);
    }
    const dest = redirectTo || getRoleHomePath(userRoles);
    navigate({ to: dest });
    setLoading(false);
  }

  return (
    <div className="section-padding">
      <div className="container-narrow flex justify-center">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold">
              <Globe className="h-6 w-6 text-gold-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
            </div>
          </div>

          {/* Demo credentials banner — REMOVE BEFORE PRODUCTION LAUNCH */}
          <div className="mb-5 rounded-lg border border-gold/40 bg-gold/5 p-4 text-xs">
            <p className="mb-2 font-semibold text-foreground">🧪 Demo accounts (click to fill)</p>
            <div className="space-y-1.5">
              {[
                { role: "Admin", email: "admin@demo.com" },
                { role: "Agent", email: "agent@demo.com" },
                { role: "Applicant", email: "applicant@demo.com" },
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => { setEmail(acc.email); setPassword("Demo1234!"); }}
                  className="flex w-full items-center justify-between rounded-md border border-border bg-card px-3 py-1.5 text-left transition hover:border-gold hover:bg-gold/10"
                >
                  <span className="font-medium">{acc.role}</span>
                  <span className="text-muted-foreground">{acc.email}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-muted-foreground">Password for all: <span className="font-mono font-semibold text-foreground">Demo1234!</span></p>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
              )}
              <div>
                <Label>Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="email" placeholder="you@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div>
                <Label>Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
              </div>
              <Button type="submit" className="w-full bg-gold text-gold-foreground hover:bg-gold/90" disabled={loading}>
                {loading ? "Signing in…" : "Sign In"} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or continue with</span></div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={googleLoading}
              onClick={async () => {
                setGoogleLoading(true);
                setError("");
                const result = await lovable.auth.signInWithOAuth("google", {
                  redirect_uri: window.location.origin,
                });
                if (result.error) {
                  setError(result.error.message || "Google sign-in failed");
                  setGoogleLoading(false);
                } else if (!result.redirected) {
                  navigate({ to: "/profile" });
                }
              }}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {googleLoading ? "Connecting…" : "Sign in with Google"}
            </Button>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline">Create Account</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
