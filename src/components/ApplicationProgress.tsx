import { useState, useEffect } from "react";
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

  const [animatedPct, setAnimatedPct] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    const t1 = requestAnimationFrame(() => {
      setAnimatedPct(percentage);
    });
    const t2 = setTimeout(() => setShowSteps(true), 300);
    return () => {
      cancelAnimationFrame(t1);
      clearTimeout(t2);
    };
  }, [percentage]);

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-foreground">Progress</p>
        <span className="text-xs font-medium text-muted-foreground">{percentage}%</span>
      </div>
      {/* Bar */}
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-2 rounded-full transition-all duration-700 ease-out",
            percentage === 100 ? "bg-green-500" : "bg-primary"
          )}
          style={{ width: `${animatedPct}%` }}
        />
      </div>
      {/* Step labels */}
      <div className="flex justify-between">
        {STEPS.map((step, i) => {
          const done = i < completed;
          return (
            <div
              key={step.key}
              className={cn(
                "flex items-center gap-1 transition-all duration-300",
                showSteps ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
              )}
              style={{ transitionDelay: `${i * 100 + 400}ms` }}
            >
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
