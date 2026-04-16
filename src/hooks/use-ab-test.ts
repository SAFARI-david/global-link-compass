import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

type ABVariant = "A" | "B" | "C";

interface ABTestConfig {
  testId: string;
  variants: ABVariant[];
  weights?: number[]; // e.g. [50, 30, 20] for 50%/30%/20% split
}

interface ABTestResult {
  variant: ABVariant;
  trackImpression: () => void;
  trackConversion: (action: string) => void;
}

function pickVariant(variants: ABVariant[], weights?: number[]): ABVariant {
  if (!weights || weights.length !== variants.length) {
    return variants[Math.floor(Math.random() * variants.length)];
  }
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < variants.length; i++) {
    r -= weights[i];
    if (r <= 0) return variants[i];
  }
  return variants[variants.length - 1];
}

export function useABTest({ testId, variants, weights }: ABTestConfig): ABTestResult {
  const [variant, setVariant] = useState<ABVariant>(() => {
    if (typeof window === "undefined") return variants[0];
    const stored = localStorage.getItem(`ab_${testId}`);
    if (stored && variants.includes(stored as ABVariant)) return stored as ABVariant;
    const picked = pickVariant(variants, weights);
    localStorage.setItem(`ab_${testId}`, picked);
    return picked;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(`ab_${testId}`);
    if (!stored || !variants.includes(stored as ABVariant)) {
      const picked = pickVariant(variants, weights);
      localStorage.setItem(`ab_${testId}`, picked);
      setVariant(picked);
    }
  }, [testId]);

  const trackImpression = useCallback(() => {
    try {
      const key = `ab_imp_${testId}_${variant}`;
      const last = sessionStorage.getItem(key);
      if (last) return; // one impression per session
      sessionStorage.setItem(key, "1");

      supabase.from("leads").insert({
        name: "AB_TEST_IMPRESSION",
        email: `ab-${testId}-${variant}@tracking.internal`,
        source: `ab_test_${testId}`,
        interest: "tracking",
        status: "tracking",
        form_data: { test_id: testId, variant, event: "impression", timestamp: new Date().toISOString() },
      } as any).then(() => {});
    } catch {}
  }, [testId, variant]);

  const trackConversion = useCallback((action: string) => {
    try {
      supabase.from("leads").insert({
        name: "AB_TEST_CONVERSION",
        email: `ab-${testId}-${variant}-${Date.now()}@tracking.internal`,
        source: `ab_test_${testId}`,
        interest: "tracking",
        status: "tracking",
        form_data: { test_id: testId, variant, event: "conversion", action, timestamp: new Date().toISOString() },
      } as any).then(() => {});
    } catch {}
  }, [testId, variant]);

  return { variant, trackImpression, trackConversion };
}
