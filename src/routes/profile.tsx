import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, Globe, MapPin, Save, LogOut, Shield, CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Global Link Migration Services" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, roles, loading, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [country, setCountry] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Populate form when profile loads
  if (profile && !initialized) {
    setFullName(profile.full_name || "");
    setPhone(profile.phone || "");
    setNationality(profile.nationality || "");
    setCountry(profile.country_of_residence || "");
    setInitialized(true);
  }

  if (loading) {
    return (
      <div className="section-padding">
        <div className="container-narrow flex justify-center">
          <div className="animate-pulse text-muted-foreground">Loading profile…</div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate({ to: "/login" });
    return null;
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await updateProfile({
      full_name: fullName,
      phone,
      nationality,
      country_of_residence: country,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="section-padding">
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                {roles.map((r) => (
                  <Badge key={r} variant="secondary" className="capitalize">{r}</Badge>
                ))}
              </div>
            </div>

            {/* Profile Form */}
            <div className="rounded-xl border bg-card p-6 shadow-sm md:p-8">
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Full Name</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className="pl-10" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className="pl-10" value={user.email || ""} disabled />
                    </div>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <div className="relative mt-1.5">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className="pl-10" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1234567890" />
                    </div>
                  </div>
                  <div>
                    <Label>Nationality</Label>
                    <div className="relative mt-1.5">
                      <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className="pl-10" value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="e.g. Nigerian" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Country of Residence</Label>
                    <div className="relative mt-1.5">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className="pl-10" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. Nigeria" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button type="submit" className="gap-1.5 bg-gold text-gold-foreground hover:bg-gold/90" disabled={saving}>
                    {saving ? "Saving…" : saved ? <><CheckCircle2 className="h-4 w-4" /> Saved</> : <><Save className="h-4 w-4" /> Save Profile</>}
                  </Button>
                  <Button type="button" variant="ghost" className="gap-1.5 text-muted-foreground" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" /> Sign Out
                  </Button>
                </div>
              </form>
            </div>

            {/* Quick Links */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link to="/dashboard" className="card-premium flex items-center gap-3 p-4 no-underline">
                <Shield className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-sm font-semibold">My Dashboard</p>
                  <p className="text-xs text-muted-foreground">Track applications & payments</p>
                </div>
              </Link>
              <Link to="/apply/work-visa" className="card-premium flex items-center gap-3 p-4 no-underline">
                <Globe className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-sm font-semibold">New Application</p>
                  <p className="text-xs text-muted-foreground">Start a work or study visa application</p>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
