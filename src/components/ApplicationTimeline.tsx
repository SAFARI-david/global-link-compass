import { useState, useEffect } from "react";
import { Clock, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  in_progress: "In Progress",
  pending_documents: "Documents Needed",
  approved: "Approved",
  rejected: "Rejected",
};

const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-amber-500",
  under_review: "bg-blue-500",
  in_progress: "bg-indigo-500",
  pending_documents: "bg-orange-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
};

interface HistoryEntry {
  id: string;
  old_status: string | null;
  new_status: string;
  notes: string | null;
  created_at: string;
}

interface ApplicationTimelineProps {
  applicationId: string;
}

export function ApplicationTimeline({ applicationId }: ApplicationTimelineProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("application_status_history")
        .select("id, old_status, new_status, notes, created_at")
        .eq("application_id", applicationId)
        .order("created_at", { ascending: true });
      setHistory((data as HistoryEntry[]) || []);
      setLoading(false);
    }
    load();
  }, [applicationId]);

  if (loading) {
    return (
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" /> Loading timeline…
      </div>
    );
  }

  if (history.length === 0) return null;

  const visible = expanded ? history : history.slice(-3);

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
      " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }

  function relativeTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  }

  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary transition-colors mb-2"
      >
        <Clock className="h-3.5 w-3.5" />
        Status Timeline
        <span className="text-muted-foreground font-normal">({history.length} update{history.length !== 1 ? "s" : ""})</span>
      </button>

      <div className="relative ml-1.5 border-l-2 border-border pl-4 space-y-0">
        {!expanded && history.length > 3 && (
          <button
            onClick={() => setExpanded(true)}
            className="mb-2 text-[10px] text-primary hover:underline"
          >
            Show {history.length - 3} earlier update{history.length - 3 !== 1 ? "s" : ""}…
          </button>
        )}

        {visible.map((entry, i) => {
          const isLatest = i === visible.length - 1 && (!expanded || i === history.length - 1);
          const dotColor = STATUS_COLORS[entry.new_status] || "bg-muted-foreground";

          return (
            <div
              key={entry.id}
              className={cn(
                "relative pb-3 last:pb-0 transition-all duration-300",
                isLatest ? "opacity-100" : "opacity-80"
              )}
            >
              {/* Dot on the timeline */}
              <div
                className={cn(
                  "absolute -left-[calc(1rem+5px)] top-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                  dotColor,
                  isLatest && "ring-2 ring-primary/20"
                )}
              />

              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                {/* Status change */}
                <div className="flex items-center gap-1 text-xs">
                  {entry.old_status ? (
                    <>
                      <span className="text-muted-foreground">
                        {STATUS_LABELS[entry.old_status] || entry.old_status}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground/60" />
                    </>
                  ) : null}
                  <span className={cn("font-semibold", isLatest ? "text-foreground" : "text-foreground/80")}>
                    {STATUS_LABELS[entry.new_status] || entry.new_status}
                  </span>
                </div>

                {/* Timestamp */}
                <span className="text-[10px] text-muted-foreground" title={formatDate(entry.created_at)}>
                  {relativeTime(entry.created_at)}
                </span>
              </div>

              {entry.notes && (
                <p className="mt-0.5 text-[10px] text-muted-foreground italic">"{entry.notes}"</p>
              )}
            </div>
          );
        })}
      </div>

      {expanded && history.length > 3 && (
        <button
          onClick={() => setExpanded(false)}
          className="mt-1 ml-5 text-[10px] text-primary hover:underline"
        >
          Show less
        </button>
      )}
    </div>
  );
}
