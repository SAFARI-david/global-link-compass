import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import crypto from "crypto";
import { z } from "zod";

const MAX_BODY_SIZE = 64 * 1024; // 64 KB

const KNOWN_EVENTS = new Set([
  "payment.completed",
  "payment.failed",
  "membership.went_valid",
  "membership.went_invalid",
  "checkout.completed",
]);

const webhookPayloadSchema = z.object({
  event: z.string().min(1).max(100).optional(),
  type: z.string().min(1).max(100).optional(),
  id: z.string().min(1).max(255).optional(),
  data: z.object({
    id: z.string().max(255).optional(),
    checkout_id: z.string().max(255).optional(),
    metadata: z.record(z.string().max(255), z.unknown()).optional(),
  }).optional(),
  metadata: z.record(z.string().max(255), z.unknown()).optional(),
}).refine((d) => d.event || d.type, {
  message: "Payload must include 'event' or 'type' field",
});

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/webhooks/whop")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Validate content type
        const contentType = request.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          return jsonError("Content-Type must be application/json", 415);
        }

        // Validate body size via Content-Length if present
        const contentLength = request.headers.get("content-length");
        if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
          return jsonError("Payload too large", 413);
        }

        // Require signature header
        const signature = request.headers.get("x-whop-signature");
        if (!signature || signature.length === 0 || signature.length > 512) {
          return jsonError("Missing or malformed x-whop-signature header", 401);
        }

        // Reject non-hex signature characters
        if (!/^[a-f0-9]+$/i.test(signature)) {
          return jsonError("Malformed signature format", 401);
        }

        const webhookSecret = process.env.WHOP_WEBHOOK_SECRET || "";
        if (!webhookSecret) {
          console.error("WHOP_WEBHOOK_SECRET is not configured");
          return jsonError("Webhook secret not configured", 500);
        }

        // Read and size-check body
        const body = await request.text();
        if (body.length === 0) {
          return jsonError("Empty request body", 400);
        }
        if (body.length > MAX_BODY_SIZE) {
          return jsonError("Payload too large", 413);
        }

        // Verify HMAC signature
        let signatureValid = false;
        try {
          const expected = crypto
            .createHmac("sha256", webhookSecret)
            .update(body)
            .digest("hex");
          signatureValid = crypto.timingSafeEqual(
            Buffer.from(signature, "hex"),
            Buffer.from(expected, "hex")
          );
        } catch {
          signatureValid = false;
        }

        if (!signatureValid) {
          return jsonError("Invalid signature", 401);
        }

        // Parse JSON
        let rawPayload: unknown;
        try {
          rawPayload = JSON.parse(body);
        } catch {
          return jsonError("Invalid JSON", 400);
        }

        // Validate payload structure
        const parsed = webhookPayloadSchema.safeParse(rawPayload);
        if (!parsed.success) {
          return jsonError("Invalid payload structure: " + parsed.error.issues[0]?.message, 422);
        }

        const payload = parsed.data;
        const eventType = payload.event || payload.type || "unknown";
        const externalEventId = payload.id || null;

        // Reject unknown event types early (log but don't process)
        const isKnownEvent = KNOWN_EVENTS.has(eventType);

        // Idempotency check
        if (externalEventId) {
          const { data: existing } = await supabaseAdmin
            .from("webhook_events")
            .select("id")
            .eq("provider", "whop")
            .eq("external_event_id", externalEventId)
            .maybeSingle();

          if (existing) {
            return Response.json({ status: "already_processed" });
          }
        }

        // Log the event
        const { data: event, error: insertErr } = await supabaseAdmin
          .from("webhook_events")
          .insert({
            provider: "whop",
            event_type: eventType,
            external_event_id: externalEventId,
            payload_json: rawPayload as Record<string, unknown>,
            signature_valid: true,
            processed: false,
          })
          .select("id")
          .single();

        if (insertErr) {
          console.error("Failed to log webhook event:", insertErr);
          return jsonError("Failed to log event", 500);
        }

        // Skip processing for unknown event types
        if (!isKnownEvent) {
          await supabaseAdmin
            .from("webhook_events")
            .update({ processed: true, processed_at: new Date().toISOString() })
            .eq("id", event.id);
          return Response.json({ status: "ignored", event_type: eventType });
        }

        // Process payment events
        let processError: string | null = null;
        try {
          const metadata = payload.data?.metadata || payload.metadata || {};
          const paymentRef = typeof metadata.payment_ref === "string" ? metadata.payment_ref : null;
          const applicationId = typeof metadata.application_id === "string" ? metadata.application_id : null;

          // Validate UUID format for applicationId
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          const validAppId = applicationId && uuidRegex.test(applicationId) ? applicationId : null;

          // Validate payment ref format (PAY-YYYY-NNNNNN)
          const payRefRegex = /^PAY-\d{4}-\d{6}$/;
          const validPayRef = paymentRef && payRefRegex.test(paymentRef) ? paymentRef : null;

          if (
            eventType === "payment.completed" ||
            eventType === "membership.went_valid" ||
            eventType === "checkout.completed"
          ) {
            if (validPayRef) {
              await supabaseAdmin
                .from("payments")
                .update({
                  payment_status: "paid",
                  paid_at: new Date().toISOString(),
                  whop_payment_id: payload.data?.id || null,
                  whop_checkout_reference: payload.data?.checkout_id || null,
                })
                .eq("internal_reference", validPayRef);
            }

            if (validAppId) {
              await supabaseAdmin
                .from("applications")
                .update({ payment_status: "paid" } as any)
                .eq("id", validAppId);
            }
          } else if (
            eventType === "payment.failed" ||
            eventType === "membership.went_invalid"
          ) {
            if (validPayRef) {
              await supabaseAdmin
                .from("payments")
                .update({ payment_status: "failed" })
                .eq("internal_reference", validPayRef);
            }
            if (validAppId) {
              await supabaseAdmin
                .from("applications")
                .update({ payment_status: "failed" } as any)
                .eq("id", validAppId);
            }
          }
        } catch (err: any) {
          processError = err.message || "Unknown processing error";
          console.error("Webhook processing error:", err);
        }

        // Update event as processed
        await supabaseAdmin
          .from("webhook_events")
          .update({
            processed: !processError,
            processed_at: new Date().toISOString(),
            error_message: processError,
          })
          .eq("id", event.id);

        return Response.json({ status: processError ? "error" : "ok" });
      },
      OPTIONS: async () => {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, x-whop-signature",
          },
        });
      },
    },
  },
});
