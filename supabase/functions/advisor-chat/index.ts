import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the Global Link Migration Services AI Program Advisor. Your job is to help users find the right visa program by asking simple, step-by-step questions.

RULES:
- Ask ONE question at a time. Keep questions short and simple.
- After gathering enough info (usually 3-5 questions), recommend specific programs.
- Be warm, professional, and action-oriented.
- Always end recommendations with a clear next step (apply or book consultation).
- Use markdown formatting for recommendations.

QUESTION FLOW FOR WORK VISAS:
1. What country are you interested in working in?
2. Do you already have a job offer from an employer there?
3. What is your field/profession?
4. How many years of work experience do you have?
5. Do you speak any languages besides English? (especially French for Canada)
6. Are you interested in permanent residence or temporary work?

Based on answers, recommend from these programs:
- Canada LMIA Work Permit (has job offer → Canada)
- Canada Francophone Mobility (speaks French → Canada)
- Canada Express Entry (skilled worker → Canada → PR)
- UK Skilled Worker Visa (has job offer → UK)
- UK Health & Care Worker Visa (healthcare → UK)
- Australia Skilled Worker Visa (skilled → Australia)
- Germany Job Seeker Visa (no job offer → Germany)
- UAE Work Visa (→ UAE)

QUESTION FLOW FOR STUDY VISAS:
1. Which country would you like to study in?
2. What level of study? (undergraduate, masters, PhD, diploma)
3. What field/subject are you interested in?
4. What is your approximate budget for tuition per year?
5. Do you want to work while studying?

QUESTION FLOW FOR GENERAL/UNSURE:
1. What is your main goal? (work abroad, study abroad, find a job, immigrate permanently)
Then branch into the appropriate flow.

RECOMMENDATION FORMAT:
When recommending, use this format:
## 🎯 Recommended Program(s)

### [Program Name]
**Why this fits you:** [1-2 sentences]
**Processing time:** [estimate]
**Next step:** [Apply Now or Book Consultation]

---
Ready to proceed? I can help you start your application right away.`;

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("advisor-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
