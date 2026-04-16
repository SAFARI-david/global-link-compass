import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, DollarSign, MapPin, ArrowRight, ArrowLeft, CheckCircle,
  Globe, Sparkles, ChevronRight, Clock, GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/guide/study")({
  head: () => ({
    meta: [
      { title: "Find Your Study Program — Global Link Migration Services" },
      { name: "description", content: "Answer a few questions and we'll recommend the best study visa programs for your goals." },
    ],
  }),
  component: StudyGuide,
});

type Question = {
  id: string;
  label: string;
  description: string;
  icon: any;
  options: { value: string; label: string; description: string }[];
};

const QUESTIONS: Question[] = [
  {
    id: "course",
    label: "What do you want to study?",
    description: "The field of study helps us match you with the right institutions and visa pathways.",
    icon: BookOpen,
    options: [
      { value: "business", label: "Business & Management", description: "MBA, Finance, Marketing, Entrepreneurship" },
      { value: "tech", label: "Technology & Engineering", description: "Computer Science, IT, Engineering, Data Science" },
      { value: "health", label: "Health & Medicine", description: "Nursing, Medicine, Public Health, Pharmacy" },
      { value: "arts", label: "Arts & Humanities", description: "Design, Media, Languages, Social Sciences" },
    ],
  },
  {
    id: "country",
    label: "Which country do you prefer to study in?",
    description: "Each country has different visa requirements, tuition costs, and post-study work opportunities.",
    icon: MapPin,
    options: [
      { value: "uk", label: "United Kingdom", description: "World-class universities, post-study work visa available" },
      { value: "canada", label: "Canada", description: "Affordable tuition, pathway to permanent residence" },
      { value: "australia", label: "Australia", description: "High quality of life, strong post-study options" },
      { value: "any", label: "Open to suggestions", description: "I'd like to see all options" },
    ],
  },
  {
    id: "budget",
    label: "What's your annual tuition budget?",
    description: "This helps us recommend programs that fit your financial situation.",
    icon: DollarSign,
    options: [
      { value: "low", label: "Under $10,000/year", description: "Budget-friendly options and scholarships" },
      { value: "mid", label: "$10,000 – $25,000/year", description: "Mid-range programs with good value" },
      { value: "high", label: "$25,000+/year", description: "Premium institutions and programs" },
      { value: "flexible", label: "Flexible budget", description: "Show me all options regardless of cost" },
    ],
  },
];

type ProgramResult = {
  id: string;
  name: string;
  slug: string;
  country: string;
  visa_type: string;
  tagline: string | null;
  best_for: string | null;
  processing_time: string | null;
  service_fee: number | null;
  currency: string | null;
  short_overview: string | null;
};

function StudyGuide() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [programs, setPrograms] = useState<ProgramResult[]>([]);
  const [loading, setLoading] = useState(false);

  function selectAnswer(value: string) {
    const qId = QUESTIONS[currentQ].id;
    setAnswers((prev) => ({ ...prev, [qId]: value }));

    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ((p) => p + 1), 300);
    } else {
      setTimeout(() => {
        setShowResults(true);
        loadRecommendations({ ...answers, [qId]: value });
      }, 300);
    }
  }

  async function loadRecommendations(a: Record<string, string>) {
    setLoading(true);
    try {
      let query = supabase
        .from("programs")
        .select("id, name, slug, country, visa_type, tagline, best_for, processing_time, service_fee, currency, short_overview")
        .eq("status", "active")
        .in("visa_type", ["Study Visa", "study_visa", "Student Visa", "student_visa"]);

      // Country filter
      const countryMap: Record<string, string[]> = {
        uk: ["UK", "United Kingdom", "England"],
        canada: ["Canada"],
        australia: ["Australia"],
      };
      if (a.country && a.country !== "any" && countryMap[a.country]) {
        query = query.in("country", countryMap[a.country]);
      }

      const { data } = await query.order("featured", { ascending: false }).limit(20);

      // Score programs
      const scored = (data || []).map((prog) => {
        let score = 0;
        const text = (prog.name + " " + (prog.best_for || "") + " " + (prog.short_overview || "") + " " + (prog.tagline || "")).toLowerCase();

        // Course matching
        const courseKeywords: Record<string, string[]> = {
          business: ["business", "mba", "management", "finance", "marketing"],
          tech: ["technology", "computer", "engineering", "data", "it", "software", "science"],
          health: ["health", "medicine", "nursing", "pharmacy", "medical"],
          arts: ["arts", "design", "media", "humanities", "social"],
        };
        if (a.course && courseKeywords[a.course]) {
          for (const kw of courseKeywords[a.course]) {
            if (text.includes(kw)) { score += 2; break; }
          }
        }

        // Budget matching
        if (a.budget === "low" && prog.service_fee && prog.service_fee < 500) score += 1;
        if (a.budget === "high" && prog.service_fee && prog.service_fee >= 500) score += 1;

        // Country exact match bonus
        if (a.country && a.country !== "any" && countryMap[a.country]?.some(c => prog.country.toLowerCase() === c.toLowerCase())) {
          score += 3;
        }

        return { ...prog, score };
      });

      scored.sort((a, b) => b.score - a.score);
      setPrograms(scored.slice(0, 5));
    } catch {
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  }

  function goBack() {
    if (showResults) {
      setShowResults(false);
      setCurrentQ(QUESTIONS.length - 1);
    } else if (currentQ > 0) {
      setCurrentQ((p) => p - 1);
    }
  }

  function restart() {
    setAnswers({});
    setCurrentQ(0);
    setShowResults(false);
    setPrograms([]);
  }

  const progress = showResults ? 100 : ((currentQ + (answers[QUESTIONS[currentQ]?.id] ? 1 : 0)) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold">Global Link Migration</span>
          </Link>
          <Badge variant="secondary" className="gap-1 text-xs">
            <GraduationCap className="h-3 w-3" /> Study Guide
          </Badge>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
        {/* Progress */}
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{showResults ? "Results" : `Question ${currentQ + 1} of ${QUESTIONS.length}`}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="mb-8 h-2" />

        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key={`q-${currentQ}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionCard
                question={QUESTIONS[currentQ]}
                selected={answers[QUESTIONS[currentQ].id]}
                onSelect={selectAnswer}
              />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ResultsPanel
                programs={programs}
                loading={loading}
                answers={answers}
                onRestart={restart}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {(currentQ > 0 || showResults) && (
          <div className="mt-6">
            <Button variant="ghost" size="sm" onClick={goBack} className="gap-1 text-muted-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionCard({ question, selected, onSelect }: { question: any; selected?: string; onSelect: (v: string) => void }) {
  const Icon = question.icon;
  return (
    <div>
      <div className="mb-6">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-xl font-bold md:text-2xl">{question.label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{question.description}</p>
      </div>

      <div className="space-y-3">
        {question.options.map((opt: any) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`w-full rounded-xl border-2 p-4 text-left transition-all hover:border-primary/50 hover:shadow-md ${
              selected === opt.value ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{opt.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{opt.description}</p>
              </div>
              {selected === opt.value && <CheckCircle className="h-5 w-5 text-primary" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultsPanel({ programs, loading, answers, onRestart }: {
  programs: ProgramResult[];
  loading: boolean;
  answers: Record<string, string>;
  onRestart: () => void;
}) {
  const courseLabels: Record<string, string> = { business: "Business", tech: "Technology", health: "Health", arts: "Arts" };
  const countryLabels: Record<string, string> = { uk: "UK", canada: "Canada", australia: "Australia", any: "Any country" };
  const budgetLabels: Record<string, string> = { low: "Under $10k", mid: "$10k–$25k", high: "$25k+", flexible: "Flexible" };

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
          <GraduationCap className="h-7 w-7 text-gold" />
        </div>
        <h1 className="text-2xl font-bold">Your Recommended Programs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Study programs matched to your preferences
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Preferences</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{courseLabels[answers.course] || answers.course}</Badge>
            <Badge variant="outline">{countryLabels[answers.country] || answers.country}</Badge>
            <Badge variant="outline">{budgetLabels[answers.budget] || answers.budget}</Badge>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : programs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No matching programs found. Try adjusting your preferences or browse all programs.</p>
            <div className="mt-4 flex justify-center gap-3">
              <Button variant="outline" onClick={onRestart}>Try Again</Button>
              <Link to="/services"><Button>Browse All Programs</Button></Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {programs.map((prog, i) => (
            <motion.div
              key={prog.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to="/services/$slug" params={{ slug: prog.slug }}>
                <Card className="group cursor-pointer overflow-hidden transition-all hover:border-primary/40 hover:shadow-lg">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {i === 0 && (
                          <Badge className="mb-2 bg-gold/10 text-gold hover:bg-gold/20">
                            <Sparkles className="mr-1 h-3 w-3" /> Best Match
                          </Badge>
                        )}
                        <h3 className="text-base font-bold group-hover:text-primary transition-colors">{prog.name}</h3>
                        {prog.tagline && <p className="mt-1 text-sm text-muted-foreground">{prog.tagline}</p>}

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {prog.country}
                          </span>
                          {prog.processing_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {prog.processing_time}
                            </span>
                          )}
                          {prog.service_fee && (
                            <span className="font-semibold text-foreground">
                              {prog.currency || "USD"} ${prog.service_fee}
                            </span>
                          )}
                        </div>

                        {prog.best_for && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            <strong>Best for:</strong> {prog.best_for}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button variant="outline" onClick={onRestart} className="gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Start Over
        </Button>
        <Link to="/services">
          <Button variant="ghost">Browse All Programs <ChevronRight className="ml-1 h-3.5 w-3.5" /></Button>
        </Link>
      </div>
    </div>
  );
}
