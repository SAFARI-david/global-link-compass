---
name: Whop Payment Architecture
description: End-to-end payment system using Whop as provider with application-to-payment-to-status workflow
type: feature
---
## Payment Provider
- Whop (hosted checkout links / embedded checkout)
- WHOP_WEBHOOK_SECRET required for webhook signature verification

## Payment Flow
1. Application submitted → saved to `applications` table
2. Payment record created in `payments` table (status: unpaid)
3. User sees premium payment summary page at `/payment/$applicationId`
4. User clicks → Whop hosted checkout opens
5. Webhook at `/api/webhooks/whop` processes payment events
6. Payment status updates: unpaid → pending → paid / failed / refunded

## Database Tables
- `payments` — linked to applications, tracks Whop references, statuses
- `pricing` — admin-managed dynamic pricing per country/visa_type/program
- `payment_addons` — optional add-on services
- `webhook_events` — idempotent webhook event logging

## Payment Statuses
unpaid, pending, paid, failed, refunded, pending_verification

## Admin Features
- `/admin/payments` — real-time payment dashboard with filters
- `/admin/pricing` — manage service fees, add-ons, Whop product IDs

## Agent Features
- `/agents/payments` — payment history for agent's clients
