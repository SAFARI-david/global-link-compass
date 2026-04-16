import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplicationProgressProps {
  paymentStatus: string;
  applicationStatus: string;
  documentCount?: number;
}

const STEPS = [
  { key: "payment", label: "Payment" },
  { key: "documents", label: "Documents" },
  { key: "review", label: "Review" },
  { key: "decision", label: "Decision" },
];

function getCompletedSteps(
  paymentStatus: string,
  applicationStatus: string,
  documentCount: number
): number {
  let completed = 0;

  // Step 1: Payment
  if (paymentStatus === "paid") completed++;
  else return completed;

  // Step 2: Documents uploaded
  if (documentCount > 0) completed++;

  // Step 3: Review (under_review, in_progress, approved, rejected)
  if (["under_review", "in_progress", "approved", "rejected"].includes(applicationStatus)) {
    completed++;
  }

  // Step 4: Decision
  if (["approved", "rejected"].includes(applicationStatus)) {
    completed++;
  }

  return completed;
}

export function ApplicationProgress({
  paymentStatus,
  applicationStatus,
  documentCount = 0,
}: ApplicationProgressProps) {
  const completed = getCompletedSteps(paymentStatus, applicationStatus, documentCount);
  const percentage = Math.round((completed / STEPS.length) * 100);

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-foreground">Progress</p>
        <span className="text-xs font-medium text-muted-foreground">{percentage}%</span>
      </div>
      {/* Bar */}
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className={cn(
            "h-2 rounded-full transition-all duration-500",
            percentage === 100 ? "bg-green-500" : "bg-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {/* Step labels */}
      <div className="flex justify-between">
        {STEPS.map((step, i) => {
          const done = i < completed;
          return (
            <div key={step.key} className="flex items-center gap-1">
              {done ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <Circle className="h-3 w-3 text-muted-foreground/40" />
              )}
              <span className={cn("text-[10px]", done ? "text-foreground font-medium" : "text-muted-foreground")}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
