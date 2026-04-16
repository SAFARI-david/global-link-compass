import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Eye, MousePointer, TrendingUp, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/admin/ab-tests")({
  component: ABTestsDashboard,
});

interface TrackingRow {
  source: string;
  form_data: any;
  created_at: string;
}

function ABTestsDashboard() {
  const [data, setData] = useState<TrackingRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: rows } = await supabase
      .from("leads")
      .select("source, form_data, created_at")
      .like("source", "ab_test_%")
      .order("created_at", { ascending: false })
      .limit(5000);
    setData((rows as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const tests = useMemo(() => {
    const testMap = new Map<string, { impressions: Map<string, number>; conversions: Map<string, { total: number; actions: Map<string, number> }> }>();

    for (const row of data) {
      const fd = row.form_data as any;
      if (!fd?.test_id || !fd?.variant) continue;
      const testId = fd.test_id;
      const variant = fd.variant;

      if (!testMap.has(testId)) {
        testMap.set(testId, { impressions: new Map(), conversions: new Map() });
      }
      const test = testMap.get(testId)!;

      if (fd.event === "impression") {
        test.impressions.set(variant, (test.impressions.get(variant) || 0) + 1);
      } else if (fd.event === "conversion") {
        if (!test.conversions.has(variant)) {
          test.conversions.set(variant, { total: 0, actions: new Map() });
        }
        const conv = test.conversions.get(variant)!;
        conv.total += 1;
        const action = fd.action || "unknown";
        conv.actions.set(action, (conv.actions.get(action) || 0) + 1);
      }
    }

    return Array.from(testMap.entries()).map(([testId, { impressions, conversions }]) => {
      const variants = Array.from(new Set([...impressions.keys(), ...conversions.keys()])).sort();
      const variantStats = variants.map((v) => {
        const imp = impressions.get(v) || 0;
        const conv = conversions.get(v) || { total: 0, actions: new Map() };
        const rate = imp > 0 ? ((conv.total / imp) * 100).toFixed(1) : "0.0";
        return { variant: v, impressions: imp, conversions: conv.total, rate: parseFloat(rate), actions: conv.actions };
      });
      const bestRate = Math.max(...variantStats.map((v) => v.rate));
      return { testId, variants: variantStats, bestRate };
    });
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" /> A/B Test Results
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor hero section performance and conversion rates</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {tests.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No A/B test data yet. Impressions and conversions will appear here as visitors interact with the homepage.
          </CardContent>
        </Card>
      )}

      {tests.map((test) => (
        <Card key={test.testId}>
          <CardHeader>
            <CardTitle className="text-lg">Test: {test.testId}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {test.variants.map((v) => {
                const isWinner = v.rate === test.bestRate && v.rate > 0;
                return (
                  <div
                    key={v.variant}
                    className={`rounded-xl border p-5 transition-all ${isWinner ? "border-gold/40 bg-gold/5 shadow-sm" : "border-border"}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Variant {v.variant}</h3>
                      {isWinner && <Badge className="bg-gold text-gold-foreground">Leading</Badge>}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" /> Impressions
                        </span>
                        <span className="text-lg font-bold">{v.impressions.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MousePointer className="h-4 w-4" /> Conversions
                        </span>
                        <span className="text-lg font-bold">{v.conversions.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-3">
                        <span className="flex items-center gap-1.5 text-sm font-medium">
                          <TrendingUp className="h-4 w-4" /> Conversion Rate
                        </span>
                        <span className={`text-xl font-extrabold ${isWinner ? "text-gold" : ""}`}>{v.rate}%</span>
                      </div>
                    </div>

                    {/* Conversion bar */}
                    <div className="mt-4 h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isWinner ? "bg-gold" : "bg-primary/60"}`}
                        style={{ width: `${Math.min(v.rate * 2, 100)}%` }}
                      />
                    </div>

                    {/* Action breakdown */}
                    {v.actions.size > 0 && (
                      <div className="mt-4 space-y-1">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Actions</p>
                        {Array.from(v.actions.entries()).map(([action, count]) => (
                          <div key={action} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{action.replace(/_/g, " ")}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">How A/B Testing Works</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p><strong>Variant A:</strong> Original — centered layout with 4 entry cards and 3 CTAs</p>
          <p><strong>Variant B:</strong> Split layout — headline left, benefit cards right, stats row</p>
          <p><strong>Variant C:</strong> Pathway-focused — minimal headline with 3 large pathway cards</p>
          <p className="pt-2">Each visitor is randomly assigned a variant (stored in localStorage). Impressions are counted once per session. Conversions track CTA clicks.</p>
        </CardContent>
      </Card>
    </div>
  );
}
