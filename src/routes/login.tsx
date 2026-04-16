import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Globe, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Global Link Migration Services" },
      { name: "description", content: "Sign in to your Global Link Migration Services account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already signed in
  if (user) {
    navigate({ to: "/profile" });
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError(error.message);
    else navigate({ to: "/profile" });
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
