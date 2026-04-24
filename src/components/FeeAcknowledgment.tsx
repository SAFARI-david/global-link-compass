import { useState } from "react";
import { CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";

interface FeeAcknowledgmentProps {
  amount: number;
  currency?: string;
  serviceLabel: string;
  /** Notifies parent whether the user has confirmed they're able to pay */
  onConfirmChange?: (confirmed: boolean) => void;
}

/**
 * Reusable fee acknowledgment block shown at the review step of every
 * application form. Displays the service fee amount and asks the applicant
 * to explicitly confirm they will be able to pay it before submitting.
 */
export function FeeAcknowledgment({
  amount,
  currency = "USD",
  serviceLabel,
  onConfirmChange,
}: FeeAcknowledgmentProps) {
  const [confirmed, setConfirmed] = useState(false);

  function handleToggle(value: boolean) {
    setConfirmed(value);
    onConfirmChange?.(value);
  }

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/5 to-transparent p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
          <CreditCard className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-foreground">Service Fee</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            {serviceLabel} — one-time professional service fee
          </p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {formatted}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {currency} • includes government & embassy fees
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-gold" /> Secure payment
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-gold" /> No hidden charges
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-gold" /> Refundable if not processed
            </span>
          </div>
        </div>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background p-3 transition-colors hover:bg-muted/40">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 accent-gold"
          checked={confirmed}
          onChange={(e) => handleToggle(e.target.checked)}
        />
        <span className="text-sm font-medium leading-snug text-foreground">
          Yes, I will be able to pay the required service fee of{" "}
          <span className="font-bold text-gold">{formatted}</span> upon submission.
        </span>
      </label>
    </div>
  );
}
