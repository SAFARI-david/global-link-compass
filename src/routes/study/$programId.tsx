import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  MapPin, ArrowLeft, GraduationCap, Calendar, CheckCircle2,
  Clock, DollarSign, Globe, Award, Briefcase, ArrowRight, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { studyPrograms } from "@/lib/study-data";

export const Route = createFileRoute("/study/$programId")({
  loader: ({ params }) => {
    const program = studyPrograms.find((p) => p.id === params.programId);
    if (!program) throw notFound();
    return program;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Program"} — Global Link Migration Services` },
      { name: "description", content: loaderData?.description?.slice(0, 155) ?? "" },
      { property: "og:title", content: loaderData?.title ?? "Study Program" },
      { property: "og:description", content: loaderData?.description?.slice(0, 155) ?? "" },
    ],
  }),
  component: ProgramDetailPage,
  notFoundComponent: () => (
    <div className="section-padding text-center">
      <GraduationCap className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
      <h1 className="text-2xl font-bold">Program Not Found</h1>
      <p className="mt-2 text-muted-foreground">This program may have been removed or the link is incorrect.</p>
      <Link to="/study"><Button variant="outline" className="mt-6">Browse All Programs</Button></Link>
    </div>
  ),
});

function ProgramDetailPage() {
  const prog = Route.useLoaderData();
  const related = studyPrograms.filter((p) => p.id !== prog.id && (p.field === prog.field || p.country === prog.country)).slice(0, 3);

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b bg-card py-3">
        <div className="container-narrow">
          <Link to="/study" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Study Opportunities
          </Link>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-narrow">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main */}
            <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="flex flex-wrap gap-2">
                <Badge>{prog.level}</Badge>
                {prog.scholarshipAvailable && <Badge variant="outline" className="gap-1 border-gold/30 text-gold"><Award className="h-3 w-3" /> Scholarship Available</Badge>}
                {prog.workPermit && <Badge variant="outline" className="gap-1"><Briefcase className="h-3 w-3" /> Post-Study Work Permit</Badge>}
              </div>

              <h1 className="mt-4 text-2xl font-bold md:text-3xl">{prog.title}</h1>
              <p className="mt-1 text-base text-muted-foreground">{prog.institution}</p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{prog.city}, {prog.country}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{prog.duration}</span>
                <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4" />{prog.tuitionRange}</span>
                <span className="flex items-center gap-1.5"><Globe className="h-4 w-4" />{prog.language}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />Intake: {prog.intake.join(", ")}</span>
              </div>

              <hr className="my-8" />

              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-bold">Program Overview</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{prog.description}</p>
                </div>

                <div>
                  <h2 className="text-lg font-bold">Program Highlights</h2>
                  <ul className="mt-2 space-y-1.5">
                    {prog.highlights.map((h: string) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-bold">Entry Requirements</h2>
                  <ul className="mt-2 space-y-1.5">
                    {prog.requirements.map((r: string) => (
                      <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>

                {prog.workPermit && (
                  <div className="rounded-lg border border-gold/20 bg-gold/5 p-5">
                    <h3 className="flex items-center gap-2 font-bold text-gold">
                      <Briefcase className="h-5 w-5" /> Post-Study Work Opportunities
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Graduates from this program are eligible for a post-study work permit, allowing you to gain valuable work experience in {prog.country} after completing your studies.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
              <div className="card-premium p-6">
                <h3 className="font-bold">Apply for this Program</h3>
                <p className="mt-1 text-xs text-muted-foreground">Start your guided study application and our team will support you through the process.</p>
                <Link to="/apply/study" className="mt-4 block">
                  <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90">Start Application</Button>
                </Link>
                <p className="mt-3 text-center text-[10px] text-muted-foreground">Agents can also apply on behalf of students.</p>
              </div>

              <div className="card-premium p-6">
                <h3 className="mb-3 font-bold">Program Summary</h3>
                <dl className="space-y-2.5 text-sm">
                  {([
                    ["Country", prog.country],
                    ["City", prog.city],
                    ["Level", prog.level],
                    ["Field", prog.field],
                    ["Duration", prog.duration],
                    ["Tuition", prog.tuitionRange],
                    ["Language", prog.language],
                    ["Intake", prog.intake.join(", ")],
                  ] as const).map(([label, val]) => (
                    <div key={label} className="flex justify-between">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="text-right font-medium">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                <Clock className="mx-auto mb-1.5 h-4 w-4" />
                We respond within 24 hours.<br />Your data is secure.
              </div>
            </motion.div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold">Related Programs</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((rp) => (
                  <Link key={rp.id} to="/study/$programId" params={{ programId: rp.id }} className="card-premium flex flex-col p-5 no-underline">
                    <Badge variant="secondary" className="mb-2 w-fit text-[10px]">{rp.level}</Badge>
                    <h3 className="text-sm font-bold">{rp.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{rp.institution}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{rp.country}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{rp.tuitionRange}</span>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      View Details <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="border-t bg-muted/30 py-6">
        <div className="container-narrow text-center text-[11px] text-muted-foreground">
          We provide professional visa application support and application management services. Final decisions are made by embassies, consulates, institutions, employers, and immigration authorities.
        </div>
      </div>
    </>
  );
}
