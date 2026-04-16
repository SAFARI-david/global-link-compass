import { useState, useEffect } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ApplicationProgressProps {
  paymentStatus: string;
  applicationStatus: string;
  documentCount?: number;
  paidAt?: string | null;
  adminNotes?: string | null;
  createdAt?: string;
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
  if (paymentStatus === "paid") completed++;
  else return completed;
  if (documentCount > 0) completed++;
  if (["under_review", "in_progress", "approved", "rejected"].includes(applicationStatus)) completed++;
  if (["approved", "rejected"].includes(applicationStatus)) completed++;
  return completed;
}

function getStepTooltip(
  stepKey: string,
  done: boolean,
  paymentStatus: string,
  applicationStatus: string,
  documentCount: number,
  paidAt?: string | null,
  adminNotes?: string | null,
): string {
  switch (stepKey) {
    case "payment":
      if (done && paidAt) return `Paid on ${new Date(paidAt).toLocaleDateString()}`;
      if (done) return "Payment completed";
      if (paymentStatus === "pending") return "Payment pending verification";
      return "Payment required to proceed";
    case "documents":
      if (done) return `${documentCount} document${documentCount !== 1 ? "s" : ""} uploaded`;
      if (paymentStatus !== "paid") return "Complete payment first";
      return "Upload your required documents";
    case "review":
      if (done && applicationStatus === "in_progress") return "Application is being processed";
      if (done) return "Review completed";
      return "Awaiting review by our team";
    case "decision":
      if (applicationStatus === "approved") return adminNotes ? `Approved — ${adminNotes}` : "Application approved ✓";
      if (applicationStatus === "rejected") return adminNotes ? `Rejected — ${adminNotes}` : "Application not approved";
      return "Final decision pending";
    default:
      return "";
  }
}

export function ApplicationProgress({
  paymentStatus,
  applicationStatus,
  documentCount = 0,
  paidAt,
  adminNotes,
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
    <TooltipProvider delayDuration={200}>
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground">Progress</p>
          <span className="text-xs font-medium text-muted-foreground">{percentage}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-700 ease-out",
              percentage === 100 ? "bg-green-500" : "bg-primary"
            )}
            style={{ width: `${animatedPct}%` }}
          />
        </div>
        <div className="flex justify-between">
          {STEPS.map((step, i) => {
            const done = i < completed;
            const tip = getStepTooltip(step.key, done, paymentStatus, applicationStatus, documentCount, paidAt, adminNotes);
            return (
              <Tooltip key={step.key}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex cursor-default items-center gap-1 transition-all duration-300",
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
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px] text-xs">
                  {tip}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
