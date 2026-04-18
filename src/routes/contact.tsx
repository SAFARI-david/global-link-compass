import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Send, MessageSquare, Shield, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Global Link Migration Services" },
      { name: "description", content: "Get in touch with Global Link Migration Services. Our team responds within 24 hours." },
      { property: "og:title", content: "Contact Global Link Migration Services" },
      { property: "og:description", content: "Get in touch with our migration specialists. We respond within 24 hours." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.error || "Failed to send message. Please try again.");
        return;
      }
      setSuccess(true);
      toast.success("Message sent — we'll be in touch within 24 hours.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy-gradient text-primary-foreground py-16 lg:py-20">
        <div className="container-narrow text-center max-w-2xl mx-auto">
          <div className="gold-divider mx-auto mb-5" />
          <h1 className="text-3xl md:text-5xl font-extrabold font-heading tracking-tight">Contact Us</h1>
          <p className="mt-4 text-base md:text-lg opacity-80">
            Have a question about a visa pathway, a current application, or partnering with us? Send us a message and our team will respond within 24 hours.
          </p>
        </div>
      </section>

      <section className="container-narrow py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold font-heading">Get in touch</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Reach us directly by email or send a message via the form. We typically reply within one business day.
              </p>
            </div>

            <a
              href="mailto:info@global-linkmigration.ca"
              className="flex items-start gap-3 rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                <Mail className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</p>
                <p className="mt-1 text-sm font-medium break-all">info@global-linkmigration.ca</p>
              </div>
            </a>

            <div className="space-y-3 rounded-xl border bg-card p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Clock className="h-4 w-4 text-gold" /> Response time
              </div>
              <p className="text-sm text-muted-foreground">Within 24 hours, Monday to Friday.</p>
            </div>

            <div className="space-y-3 rounded-xl border bg-card p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Shield className="h-4 w-4 text-gold" /> Privacy
              </div>
              <p className="text-sm text-muted-foreground">
                Your details are handled confidentially and only used to respond to your enquiry.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">Send us a message</h2>
              </div>

              {success ? (
                <div className="rounded-lg border border-green-600/20 bg-green-50/40 p-6 text-center">
                  <p className="font-semibold text-green-700">Thanks — message received.</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We'll reply to your email within 24 hours.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => setSuccess(false)}>
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name" required maxLength={200}
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="Your full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email" type="email" required maxLength={255}
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="you@email.com"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input
                        id="phone" type="tel" maxLength={50}
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="+1 555 123 4567"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject (optional)</Label>
                      <Input
                        id="subject" maxLength={250}
                        value={form.subject}
                        onChange={(e) => update("subject", e.target.value)}
                        placeholder="What's your enquiry about?"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message" required maxLength={5000} rows={6}
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      placeholder="Tell us about your situation, the country you're interested in, and any timing considerations…"
                      className="mt-1 resize-none"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {form.message.length}/5000 characters
                    </p>
                  </div>

                  <Button type="submit" variant="gold" size="lg" disabled={submitting} className="w-full sm:w-auto">
                    {submitting ? "Sending…" : (
                      <>Send message <Send className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
