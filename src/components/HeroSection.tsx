import { useEffect } from "react";
import { useABTest } from "@/hooks/use-ab-test";
import { HeroVariantA } from "@/components/hero-variants/HeroVariantA";
import { HeroVariantB } from "@/components/hero-variants/HeroVariantB";
import { HeroVariantC } from "@/components/hero-variants/HeroVariantC";

export function HeroSection() {
  const { variant, trackImpression, trackConversion } = useABTest({
    testId: "homepage_hero_v1",
    variants: ["A", "B", "C"],
    weights: [34, 33, 33],
  });

  useEffect(() => {
    trackImpression();
  }, [trackImpression]);

  const handleCtaClick = (action: string) => {
    trackConversion(action);
  };

  switch (variant) {
    case "B":
      return <HeroVariantB onCtaClick={handleCtaClick} />;
    case "C":
      return <HeroVariantC onCtaClick={handleCtaClick} />;
    default:
      return <HeroVariantA onCtaClick={handleCtaClick} />;
  }
}
