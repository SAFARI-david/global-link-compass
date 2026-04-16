import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Upload, Shield } from "lucide-react";
import { AgentSidebar } from "@/components/agent/AgentSidebar";
import { AgentHeader } from "@/components/agent/AgentHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/agents/applications/work-visa")({
  head: () => ({
    meta: [{ title: "Submit Work Visa Application — Agent Portal" }],
  }),
  component: AgentWorkVisaPage,
});

const steps = [
  "Select Client",
  "Personal Info",
  "Passport & Travel",
  "Education & Work",
  "Destination",
  "Documents",
  "Review & Proceed",
];

function AgentWorkVisaPage() {
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
                Reference: <span className="font-semibold text-foreground">WV-2024-0013</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Our team will review the application and contact you within 24 hours.
              </p>
              <div className="mt-6 flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate({ to: "/agents/applications" })}>
                  View Applications
                </Button>
                <Button variant="gold" onClick={() => navigate({ to: "/agents/dashboard" })}>
                  Dashboard
                </Button>
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
            <h1 className="text-2xl font-bold text-foreground">Submit Work Visa Application</h1>
            <p className="mt-1 text-sm text-muted-foreground">Submit on behalf of your client</p>

            {/* Progress */}
            <div className="mt-6 mb-8">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{steps[currentStep]}</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
              <div className="mt-2 hidden sm:flex justify-between">
                {steps.map((step, i) => (
                  <span key={step} className={`text-[10px] ${i <= currentStep ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    {step}
                  </span>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{steps[currentStep]}</CardTitle>
              </CardHeader>
              <CardContent>
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Select an existing client or add details for a new one.</p>
                    <div className="space-y-2">
                      <Label>Search Existing Client</Label>
                      <Input placeholder="Search by name or email..." />
                    </div>
                    <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                      <p>Or enter client details manually below</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2"><Label>First Name</Label><Input placeholder="First name" /></div>
                      <div className="space-y-2"><Label>Last Name</Label><Input placeholder="Last name" /></div>
                      <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="Email" /></div>
                      <div className="space-y-2"><Label>Phone</Label><Input type="tel" placeholder="Phone" /></div>
                    </div>
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" /></div>
                    <div className="space-y-2"><Label>Gender</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                        <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2"><Label>Nationality</Label><Input placeholder="Nationality" /></div>
                    <div className="space-y-2"><Label>Country of Residence</Label><Input placeholder="Country" /></div>
                    <div className="space-y-2"><Label>Marital Status</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                        <option value="">Select</option><option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                      </select>
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"><Label>Passport Available</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                        <option>Yes</option><option>No</option>
                      </select>
                    </div>
                    <div className="space-y-2"><Label>Passport Expiry</Label><Input type="date" /></div>
                    <div className="space-y-2 sm:col-span-2"><Label>Previous Travel History</Label><Input placeholder="Countries visited" /></div>
                    <div className="space-y-2"><Label>Previous Visa Refusals</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                        <option>No</option><option>Yes</option>
                      </select>
                    </div>
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"><Label>Highest Education</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                        <option value="">Select</option><option>High School</option><option>Diploma</option><option>Bachelor's</option><option>Master's</option><option>PhD</option>
                      </select>
                    </div>
                    <div className="space-y-2"><Label>Field of Study</Label><Input placeholder="Field of study" /></div>
                    <div className="space-y-2"><Label>Current Occupation</Label><Input placeholder="Current job title" /></div>
                    <div className="space-y-2"><Label>Years of Experience</Label><Input type="number" placeholder="Years" /></div>
                    <div className="space-y-2"><Label>Industry</Label><Input placeholder="Industry" /></div>
                    <div className="space-y-2"><Label>English Level</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                        <option value="">Select</option><option>Basic</option><option>Intermediate</option><option>Advanced</option><option>Fluent</option><option>Native</option>
                      </select>
                    </div>
                  </div>
                )}
                {currentStep === 4 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"><Label>Destination Country</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                        <option value="">Select</option><option>Canada</option><option>Australia</option><option>United Kingdom</option><option>Germany</option><option>New Zealand</option>
                      </select>
                    </div>
                    <div className="space-y-2"><Label>Preferred Visa Program</Label><Input placeholder="e.g. LMIA, Skilled Worker" /></div>
                    <div className="space-y-2"><Label>Preferred Job Category</Label><Input placeholder="Job category" /></div>
                    <div className="space-y-2"><Label>Salary Expectation</Label><Input placeholder="Expected salary range" /></div>
                    <div className="space-y-2"><Label>Open to Unskilled Jobs?</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                        <option>No</option><option>Yes</option>
                      </select>
                    </div>
                    <div className="space-y-2"><Label>Ready to Relocate Immediately?</Label>
                      <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                        <option>No</option><option>Yes</option>
                      </select>
                    </div>
                  </div>
                )}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Upload required documents for the application.</p>
                    {["Passport Copy", "CV / Resume", "Education Certificates", "Language Test Results", "Other Documents"].map((doc) => (
                      <div key={doc} className="flex items-center justify-between rounded-lg border border-dashed border-border p-4">
                        <div>
                          <p className="text-sm font-medium">{doc}</p>
                          <p className="text-xs text-muted-foreground">PDF, JPG, PNG — Max 10MB</p>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Upload className="h-3.5 w-3.5" /> Upload
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {currentStep === 6 && (
                  <div className="space-y-5">
                    <p className="text-sm text-muted-foreground">Review all details before submitting. You can go back to edit any section.</p>
                    <div className="space-y-3">
                      {steps.slice(0, -1).map((step, i) => (
                        <div key={step} className="flex items-center justify-between rounded-lg border border-border p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</div>
                            <span className="text-sm font-medium">{step}</span>
                          </div>
                          <button className="text-xs font-medium text-primary hover:underline" onClick={() => setCurrentStep(i)}>Edit</button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-start gap-2">
                      <input type="checkbox" id="agent-consent" className="mt-1 h-4 w-4 rounded border-input" />
                      <label htmlFor="agent-consent" className="text-sm text-muted-foreground">
                        I confirm that I have obtained consent from my client to submit this application and that all information provided is accurate to the best of my knowledge.
                      </label>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                      <Shield className="h-4 w-4 flex-shrink-0" />
                      <span>All data is encrypted and processed securely. We will contact you within 24 hours.</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button onClick={() => setCurrentStep(currentStep + 1)}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button variant="gold" onClick={() => setSubmitted(true)}>
                  Proceed with Application <CheckCircle2 className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
