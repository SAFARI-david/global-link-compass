import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  MapPin, ArrowLeft, Plane, Calendar, CheckCircle2,
  Clock, Globe, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { visitDestinations } from "@/lib/visit-data";

export const Route = createFileRoute("/visit/$destinationId")({
  loader: ({ params }) => {
    const dest = visitDestinations.find((d) => d.id === params.destinationId);
    if (!dest) throw notFound();
    return dest;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Visit Visa"} — Global Link Migration Services` },
      { name: "description", content: loaderData?.description?.slice(0, 155) ?? "" },
      { property: "og:title", content: loaderData?.title ?? "Visit Visa" },
      { property: "og:description", content: loaderData?.description?.slice(0, 155) ?? "" },
    ],
  }),
  component: DestinationDetailPage,
  notFoundComponent: () => (
    <div className="section-padding text-center">
      <Plane className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
      <h1 className="text-2xl font-bold">Destination Not Found</h1>
      <p className="mt-2 text-muted-foreground">This visa option may have been removed or the link is incorrect.</p>
      <Link to="/visit"><Button variant="outline" className="mt-6">Browse All Visit Visas</Button></Link>
    </div>
  ),
});

function DestinationDetailPage() {
  const dest = Route.useLoaderData();
  const related = visitDestinations.filter((d) => d.id !== dest.id && (d.visaType === dest.visaType || d.country === dest.country)).slice(0, 3);

  return (
    <>
      <div className="border-b bg-card py-3">
        <div className="container-narrow">
          <Link to="/visit" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Visit Visa Options
          </Link>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-narrow">
          <div className="grid gap-8 lg:grid-cols-3">
            <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="flex flex-wrap gap-2">
                <Badge>{dest.visaType}</Badge>
                {dest.multipleEntry && <Badge variant="outline" className="gap-1 border-gold/30 text-gold"><CheckCircle2 className="h-3 w-3" /> Multiple Entry</Badge>}
              </div>

              <h1 className="mt-4 text-2xl font-bold md:text-3xl">{dest.title}</h1>
              <p className="mt-1 text-base text-muted-foreground">{dest.purpose}</p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{dest.city}, {dest.country}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{dest.processingTime}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{dest.duration}</span>
                <span className="flex items-center gap-1.5"><Globe className="h-4 w-4" />{dest.language}</span>
              </div>

              <hr className="my-8" />

              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-bold">About this Visa</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{dest.description}</p>
                </div>

                <div>
                  <h2 className="text-lg font-bold">Highlights</h2>
                  <ul className="mt-2 space-y-1.5">
                    {dest.highlights.map((h: string) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-bold">Typical Requirements</h2>
                  <ul className="mt-2 space-y-1.5">
                    {dest.requirements.map((r: string) => (
                      <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
              <div className="card-premium p-6">
                <h3 className="font-bold">Apply for this Visit Visa</h3>
                <p className="mt-1 text-xs text-muted-foreground">Start your guided visit visa application — our team will review your case and confirm next steps.</p>
                <Link to="/apply/visit-visa" className="mt-4 block">
                  <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90">Start Application</Button>
                </Link>
                <p className="mt-3 text-center text-[10px] text-muted-foreground">No payment required at this stage.</p>
              </div>

              <div className="card-premium p-6">
                <h3 className="mb-3 font-bold">Visa Summary</h3>
                <dl className="space-y-2.5 text-sm">
                  {([
                    ["Country", dest.country],
                    ["Type", dest.visaType],
                    ["Purpose", dest.purpose],
                    ["Stay Duration", dest.duration],
                    ["Processing", dest.processingTime],
                    ["Validity", dest.validity],
                    ["Multi-Entry", dest.multipleEntry ? "Yes" : "No"],
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

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold">Related Visit Visas</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((rd) => (
                  <Link key={rd.id} to="/visit/$destinationId" params={{ destinationId: rd.id }} className="card-premium flex flex-col p-5 no-underline">
                    <Badge variant="secondary" className="mb-2 w-fit text-[10px]">{rd.visaType}</Badge>
                    <h3 className="text-sm font-bold">{rd.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{rd.purpose}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{rd.country}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{rd.processingTime}</span>
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
          We provide professional visa application support and application management services. Final decisions are made by embassies, consulates, and immigration authorities.
        </div>
      </div>
    </>
  );
}
