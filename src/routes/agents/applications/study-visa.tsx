import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Upload, Shield } from "lucide-react";
import { AgentSidebar } from "@/components/agent/AgentSidebar";
import { AgentHeader } from "@/components/agent/AgentHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/agents/applications/study-visa")({
  head: () => ({
    meta: [{ title: "Submit Study Visa Application — Agent Portal" }],
  }),
  component: AgentStudyVisaPage,
});

const steps = [
  "Select Client",
  "Education Background",
  "Study Preferences",
  "Financial Profile",
  "Documents",
  "Review & Submit",
];

function AgentStudyVisaPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex min-h-screen bg-surface">
        <AgentSidebar />
        <div className="flex flex-1 flex-col">
          <AgentHeader />
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="max-w-sm text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Application Submitted</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Reference: <span className="font-semibold text-foreground">SV-2024-0009</span>
              </p>
              <div className="mt-6 flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate({ to: "/agents/applications" })}>View Applications</Button>
                <Button variant="gold" onClick={() => navigate({ to: "/agents/dashboard" })}>Dashboard</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <AgentSidebar />
      <div className="flex flex-1 flex-col">
        <AgentHeader />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-2xl font-bold text-foreground">Submit Study Visa Application</h1>
            <p className="mt-1 text-sm text-muted-foreground">Submit on behalf of your client</p>

            {/* Progress */}
            <div className="mt-6 mb-8">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{steps[currentStep]}</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary transition-all duration-300" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
              </div>
            </div>

            <Card>
              <CardHeader><CardTitle className="text-base">{steps[currentStep]}</CardTitle></CardHeader>
              <CardContent>
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div className="space-y-2"><Label>Search Existing Client</Label><Input placeholder="Search by name or email..." /></div>
                    <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">Or enter new client details</div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2"><Label>First Name</Label><Input placeholder="First name" /></div>
                      <div className="space-y-2"><Label>Last Name</Label><Input placeholder="Last name" /></div>
                      <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="Email" /></div>
                      <div className="space-y-2"><Label>Nationality</Label><Input placeholder="Nationality" /></div>
                    </div>
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"><Label>Highest Education Level</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                        <option value="">Select</option><option>High School</option><option>Diploma</option><option>Bachelor's</option><option>Master's</option><option>PhD</option>
                      </select>
                    </div>
                    <div className="space-y-2"><Label>Last Institution</Label><Input placeholder="School/University name" /></div>
                    <div className="space-y-2"><Label>GPA / Grades</Label><Input placeholder="GPA or grade" /></div>
                    <div className="space-y-2"><Label>Graduation Year</Label><Input type="number" placeholder="Year" /></div>
                    <div className="space-y-2"><Label>English Proficiency Level</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                        <option value="">Select</option><option>Basic</option><option>Intermediate</option><option>Advanced</option><option>Fluent</option><option>Native</option>
                      </select>
                    </div>
                    <div className="space-y-2"><Label>Test Score (IELTS/TOEFL)</Label><Input placeholder="Score if available" /></div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"><Label>Desired Course / Program</Label><Input placeholder="e.g. Computer Science, Business" /></div>
                    <div className="space-y-2"><Label>Destination Country</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                        <option value="">Select</option><option>Canada</option><option>UK</option><option>Australia</option><option>Germany</option><option>USA</option>
                      </select>
                    </div>
                    <div className="space-y-2"><Label>Study Level</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                        <option value="">Select</option><option>Diploma</option><option>Undergraduate</option><option>Postgraduate</option><option>PhD</option><option>Certificate</option>
                      </select>
                    </div>
                    <div className="space-y-2"><Label>Preferred Intake</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                        <option value="">Select</option><option>Jan 2025</option><option>May 2025</option><option>Sep 2025</option><option>Jan 2026</option>
                      </select>
                    </div>
                    <div className="space-y-2"><Label>Tuition Budget</Label><Input placeholder="Budget range in USD" /></div>
                    <div className="space-y-2"><Label>Preferred City / Region</Label><Input placeholder="City or region" /></div>
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"><Label>Funding Source</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                        <option value="">Select</option><option>Self-funded</option><option>Family sponsor</option><option>Scholarship</option><option>Loan</option>
                      </select>
                    </div>
                    <div className="space-y-2"><Label>Living Cost Budget (Monthly)</Label><Input placeholder="Monthly budget in USD" /></div>
                    <div className="space-y-2"><Label>Bank Statement Available?</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"><option>Yes</option><option>No</option></select>
                    </div>
                    <div className="space-y-2"><Label>Previous Study Visa Refusals</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"><option>No</option><option>Yes</option></select>
                    </div>
                  </div>
                )}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    {["Passport Copy", "Academic Transcripts", "CV / Resume", "Language Test Certificate", "Motivation Letter", "Other Documents"].map((doc) => (
                      <div key={doc} className="flex items-center justify-between rounded-lg border border-dashed border-border p-4">
                        <div><p className="text-sm font-medium">{doc}</p><p className="text-xs text-muted-foreground">PDF, JPG, PNG — Max 10MB</p></div>
                        <Button variant="outline" size="sm" className="gap-2"><Upload className="h-3.5 w-3.5" /> Upload</Button>
                      </div>
                    ))}
                  </div>
                )}
                {currentStep === 5 && (
                  <div className="space-y-5">
                    <p className="text-sm text-muted-foreground">Review all details before submitting.</p>
                    {steps.slice(0, -1).map((step, i) => (
                      <div key={step} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</div>
                          <span className="text-sm font-medium">{step}</span>
                        </div>
                        <button className="text-xs font-medium text-primary hover:underline" onClick={() => setCurrentStep(i)}>Edit</button>
                      </div>
                    ))}
                    <div className="flex items-start gap-2">
                      <input type="checkbox" id="study-consent" className="mt-1 h-4 w-4 rounded border-input" />
                      <label htmlFor="study-consent" className="text-sm text-muted-foreground">
                        I confirm all information is accurate and I have my client's consent to submit this application.
                      </label>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                      <Shield className="h-4 w-4 flex-shrink-0" />
                      <span>All data is encrypted and processed securely.</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button onClick={() => setCurrentStep(currentStep + 1)}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
              ) : (
                <Button variant="gold" onClick={() => setSubmitted(true)}>Submit Application <CheckCircle2 className="ml-2 h-4 w-4" /></Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
