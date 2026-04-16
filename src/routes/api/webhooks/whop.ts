import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import crypto from "crypto";

export const Route = createFileRoute("/api/webhooks/whop")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        const signature = request.headers.get("x-whop-signature") || "";
        const webhookSecret = process.env.WHOP_WEBHOOK_SECRET || "";

        // Verify signature if secret is configured
        let signatureValid = false;
        if (webhookSecret) {
          const expected = crypto
            .createHmac("sha256", webhookSecret)
            .update(body)
            .digest("hex");
          signatureValid = crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expected)
          );
        }

        let payload: any;
        try {
          payload = JSON.parse(body);
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const eventType = payload.event || payload.type || "unknown";
        const externalEventId = payload.id || null;

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
            payload_json: payload,
            signature_valid: signatureValid,
            processed: false,
          })
          .select("id")
          .single();

        if (insertErr) {
          console.error("Failed to log webhook event:", insertErr);
          return Response.json({ error: "Failed to log event" }, { status: 500 });
        }

        // Process payment events
        let processError: string | null = null;
        try {
          const metadata = payload.data?.metadata || payload.metadata || {};
          const paymentRef = metadata.payment_ref;
          const applicationId = metadata.application_id;

          if (
            eventType === "payment.completed" ||
            eventType === "membership.went_valid" ||
            eventType === "checkout.completed"
          ) {
            if (paymentRef) {
              await supabaseAdmin
                .from("payments")
                .update({
                  payment_status: "paid",
                  paid_at: new Date().toISOString(),
                  whop_payment_id: payload.data?.id || null,
                  whop_checkout_reference: payload.data?.checkout_id || null,
                })
                .eq("internal_reference", paymentRef);
            }

            if (applicationId) {
              await supabaseAdmin
                .from("applications")
                .update({ payment_status: "paid" } as any)
                .eq("id", applicationId);
            }
          } else if (
            eventType === "payment.failed" ||
            eventType === "membership.went_invalid"
          ) {
            if (paymentRef) {
              await supabaseAdmin
                .from("payments")
                .update({ payment_status: "failed" })
                .eq("internal_reference", paymentRef);
            }
            if (applicationId) {
              await supabaseAdmin
                .from("applications")
                .update({ payment_status: "failed" } as any)
                .eq("id", applicationId);
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
