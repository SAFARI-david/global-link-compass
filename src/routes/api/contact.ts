import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const CONTACT_EMAIL = "info@global-linkmigration.ca";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

async function sendEmailViaResend(payload: Required<Pick<ContactPayload, "name" | "email" | "message">> & { phone?: string; subject?: string; }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { skipped: true as const };

  const subject = payload.subject?.trim() || `New contact form message from ${payload.name}`;
  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    ${payload.phone ? `<p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>` : ""}
    ${payload.subject ? `<p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "Global Link Contact <onboarding@resend.dev>",
      to: [CONTACT_EMAIL],
      reply_to: payload.email,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { skipped: false as const, ok: false as const, error: text };
  }
  return { skipped: false as const, ok: true as const };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: ContactPayload;
        try {
          body = (await request.json()) as ContactPayload;
        } catch {
          return jsonResponse({ error: "Invalid JSON" }, 400);
        }

        const name = body.name?.trim() ?? "";
        const email = body.email?.trim() ?? "";
        const phone = body.phone?.trim() || undefined;
        const subject = body.subject?.trim() || undefined;
        const message = body.message?.trim() ?? "";

        if (name.length < 2 || name.length > 200) {
          return jsonResponse({ error: "Please enter your name." }, 400);
        }
        if (!isEmail(email) || email.length > 255) {
          return jsonResponse({ error: "Please enter a valid email." }, 400);
        }
        if (message.length < 5 || message.length > 5000) {
          return jsonResponse({ error: "Please enter a message (5–5000 characters)." }, 400);
        }
        if (subject && subject.length > 250) {
          return jsonResponse({ error: "Subject is too long." }, 400);
        }
        if (phone && phone.length > 50) {
          return jsonResponse({ error: "Phone number is too long." }, 400);
        }

        // 1. Save to leads (source: contact_form)
        const { error: dbError } = await supabaseAdmin.from("leads").insert({
          name,
          email,
          phone: phone ?? null,
          source: "contact_form",
          interest: subject ?? "Contact form",
          status: "new",
          form_data: { subject, message, phone },
        });

        if (dbError) {
          console.error("[contact] failed to save lead:", dbError);
          return jsonResponse({ error: "Could not save your message. Please try again." }, 500);
        }

        // 2. Send email via Resend (best-effort)
        try {
          const result = await sendEmailViaResend({
            name,
            email,
            phone,
            subject,
            message,
          });
          if (!result.skipped && !result.ok) {
            console.error("[contact] Resend send failed:", result.error);
          }
        } catch (err) {
          console.error("[contact] Resend exception:", err);
        }

        return jsonResponse({ ok: true });
      },
    },
  },
});
