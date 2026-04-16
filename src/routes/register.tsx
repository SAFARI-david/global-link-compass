import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Globe, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — Global Link Migration Services" },
      { name: "description", content: "Create your Global Link Migration Services account to start your application." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (user) {
    navigate({ to: "/profile" });
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    if (error) setError(error.message);
    else setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="section-padding">
        <div className="container-narrow flex justify-center">
          <motion.div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
              <CheckCircle2 className="h-8 w-8 text-gold" />
            </div>
            <h1 className="text-2xl font-bold">Check Your Email</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              We've sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.
            </p>
            <Link to="/login"><Button className="mt-6" variant="outline">Go to Sign In</Button></Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-narrow flex justify-center">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold">
              <Globe className="h-6 w-6 text-gold-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Create Your Account</h1>
              <p className="mt-1 text-sm text-muted-foreground">Start your visa or study application journey</p>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
              <div>
                <Label>Full Name</Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Your full name" className="pl-10" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
              </div>
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
                  <Input type={showPassword ? "text" : "password"} placeholder="Min 6 characters" className="pl-10 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-gold text-gold-foreground hover:bg-gold/90" disabled={loading}>
                {loading ? "Creating account…" : "Create Account"} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
