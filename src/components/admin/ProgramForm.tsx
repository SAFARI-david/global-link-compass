import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Save, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DocItem { name: string; required: boolean; }
interface StepItem { title: string; description: string; order: number; }
interface FaqItem { question: string; answer: string; }

const COUNTRIES = ["Canada", "United Kingdom", "Australia", "Germany", "United States", "France", "New Zealand", "Ireland", "Switzerland", "Netherlands"];
const VISA_TYPES = ["Work Visa", "Study Visa", "Visit Visa", "Business Visa", "Family Visa", "Investment Visa"];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function ProgramForm({ program, onSuccess }: { program?: any; onSuccess: () => void }) {
  const isEdit = !!program;

  // Basic
  const [name, setName] = useState(program?.name || "");
  const [slug, setSlug] = useState(program?.slug || "");
  const [country, setCountry] = useState(program?.country || "");
  const [visaType, setVisaType] = useState(program?.visa_type || "");
  const [category, setCategory] = useState(program?.category || "");
  const [tagline, setTagline] = useState(program?.tagline || "");
  const [status, setStatus] = useState(program?.status || "draft");
  const [featured, setFeatured] = useState(program?.featured || false);

  // Overview
  const [shortOverview, setShortOverview] = useState(program?.short_overview || "");
  const [fullDescription, setFullDescription] = useState(program?.full_description || "");
  const [whyChoose, setWhyChoose] = useState(program?.why_choose || "");
  const [bestFor, setBestFor] = useState(program?.best_for || "");

  // Eligibility
  const [eligibilitySummary, setEligibilitySummary] = useState(program?.eligibility_summary || "");
  const [educationReq, setEducationReq] = useState(program?.education_requirement || "");
  const [workExpReq, setWorkExpReq] = useState(program?.work_experience_requirement || "");
  const [languageReq, setLanguageReq] = useState(program?.language_requirement || "");
  const [otherConditions, setOtherConditions] = useState(program?.other_conditions || "");

  // Documents
  const [documents, setDocuments] = useState<DocItem[]>(
    program?.required_documents || [{ name: "", required: true }]
  );

  // Steps
  const [steps, setSteps] = useState<StepItem[]>(
    program?.process_steps || [{ title: "", description: "", order: 1 }]
  );

  // Fees
  const [serviceFee, setServiceFee] = useState(program?.service_fee?.toString() || "");
  const [currency, setCurrency] = useState(program?.currency || "USD");
  const [processingTime, setProcessingTime] = useState(program?.processing_time || "");
  const [govFeesIncluded, setGovFeesIncluded] = useState(program?.government_fees_included || false);
  const [separateCosts, setSeparateCosts] = useState(program?.separate_costs || "");
  const [paymentNote, setPaymentNote] = useState(program?.payment_note || "");

  // Benefits
  const [benefits, setBenefits] = useState<string[]>(program?.benefits || [""]);

  // FAQs
  const [faqs, setFaqs] = useState<FaqItem[]>(program?.faqs || [{ question: "", answer: "" }]);

  // Extra
  const [familyOption, setFamilyOption] = useState(program?.family_dependant_option || "");
  const [whatsIncluded, setWhatsIncluded] = useState<string[]>(program?.whats_included || [""]);
  const [whatsNotIncluded, setWhatsNotIncluded] = useState<string[]>(program?.whats_not_included || [""]);

  // SEO
  const [metaTitle, setMetaTitle] = useState(program?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(program?.meta_description || "");

  // CTA
  const [ctaApply, setCtaApply] = useState(program?.cta_apply_text || "Apply Now");
  const [ctaConsult, setCtaConsult] = useState(program?.cta_consult_text || "Book Consultation");

  const [saving, setSaving] = useState(false);

  const handleNameChange = (v: string) => {
    setName(v);
    if (!isEdit) setSlug(slugify(v));
  };

  const handleSave = async () => {
    if (!name || !country || !visaType || !slug) {
      toast.error("Name, country, visa type, and slug are required");
      return;
    }
    setSaving(true);

    const payload = {
      name, slug, country, visa_type: visaType, category: category || null, tagline: tagline || null,
      status, featured,
      short_overview: shortOverview || null, full_description: fullDescription || null,
      why_choose: whyChoose || null, best_for: bestFor || null,
      eligibility_summary: eligibilitySummary || null,
      education_requirement: educationReq || null,
      work_experience_requirement: workExpReq || null,
      language_requirement: languageReq || null,
      other_conditions: otherConditions || null,
      required_documents: documents.filter((d) => d.name),
      process_steps: steps.filter((s) => s.title).map((s, i) => ({ ...s, order: i + 1 })),
      service_fee: serviceFee ? parseFloat(serviceFee) : null,
      currency, processing_time: processingTime || null,
      government_fees_included: govFeesIncluded,
      separate_costs: separateCosts || null,
      payment_note: paymentNote || null,
      benefits: benefits.filter(Boolean),
      faqs: faqs.filter((f) => f.question),
      family_dependant_option: familyOption || null,
      whats_included: whatsIncluded.filter(Boolean),
      whats_not_included: whatsNotIncluded.filter(Boolean),
      meta_title: metaTitle || null, meta_description: metaDescription || null,
      cta_apply_text: ctaApply, cta_consult_text: ctaConsult,
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase.from("programs").update(payload).eq("id", program.id));
    } else {
      ({ error } = await supabase.from("programs").insert(payload));
    }

    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(isEdit ? "Program updated" : "Program created");
    onSuccess();
  };

  const addDoc = () => setDocuments([...documents, { name: "", required: true }]);
  const removeDoc = (i: number) => setDocuments(documents.filter((_, j) => j !== i));
  const updateDoc = (i: number, field: string, val: any) => {
    const next = [...documents];
    (next[i] as any)[field] = val;
    setDocuments(next);
  };

  const addStep = () => setSteps([...steps, { title: "", description: "", order: steps.length + 1 }]);
  const removeStep = (i: number) => setSteps(steps.filter((_, j) => j !== i));
  const updateStep = (i: number, field: string, val: string) => {
    const next = [...steps];
    (next[i] as any)[field] = val;
    setSteps(next);
  };

  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);
  const removeFaq = (i: number) => setFaqs(faqs.filter((_, j) => j !== i));
  const updateFaq = (i: number, field: string, val: string) => {
    const next = [...faqs];
    (next[i] as any)[field] = val;
    setFaqs(next);
  };

  const addBenefit = () => setBenefits([...benefits, ""]);
  const addIncluded = () => setWhatsIncluded([...whatsIncluded, ""]);
  const addNotIncluded = () => setWhatsNotIncluded([...whatsNotIncluded, ""]);

  return (
    <div className="max-w-4xl space-y-6">
      {/* Sticky save bar */}
      <div className="flex items-center justify-between rounded-lg border bg-card p-4">
        <div>
          <h2 className="text-lg font-semibold">{isEdit ? "Edit Program" : "Create New Program"}</h2>
          <p className="text-sm text-muted-foreground">Fill in the sections below. Required fields are marked.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onSuccess}>Cancel</Button>
          <Button variant="gold" onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />{saving ? "Saving..." : "Save Program"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="extras">Extras</TabsTrigger>
          <TabsTrigger value="seo">SEO & CTA</TabsTrigger>
        </TabsList>

        {/* Basic */}
        <TabsContent value="basic">
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Program Name *</Label>
                  <Input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. LMIA Program" />
                </div>
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Visa Type *</Label>
                  <Select value={visaType} onValueChange={setVisaType}>
                    <SelectTrigger><SelectValue placeholder="Select visa type" /></SelectTrigger>
                    <SelectContent>
                      {VISA_TYPES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Employer-Sponsored" />
                </div>
                <div className="space-y-2">
                  <Label>Short Tagline</Label>
                  <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Brief one-liner" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch checked={featured} onCheckedChange={setFeatured} />
                  <Label>Featured Program</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overview */}
        <TabsContent value="overview">
          <Card>
            <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Short Overview</Label>
                <Textarea rows={3} value={shortOverview} onChange={(e) => setShortOverview(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Full Description</Label>
                <Textarea rows={6} value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Why Choose This Program</Label>
                <Textarea rows={3} value={whyChoose} onChange={(e) => setWhyChoose(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Best For</Label>
                <Input value={bestFor} onChange={(e) => setBestFor(e.target.value)} placeholder="e.g. Skilled professionals with job offers" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Eligibility */}
        <TabsContent value="eligibility">
          <Card>
            <CardHeader><CardTitle>Eligibility Requirements</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Eligibility Summary</Label>
                <Textarea rows={3} value={eligibilitySummary} onChange={(e) => setEligibilitySummary(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Education Requirement</Label>
                  <Textarea rows={2} value={educationReq} onChange={(e) => setEducationReq(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Work Experience Requirement</Label>
                  <Textarea rows={2} value={workExpReq} onChange={(e) => setWorkExpReq(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Language Requirement</Label>
                  <Textarea rows={2} value={languageReq} onChange={(e) => setLanguageReq(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Other Conditions</Label>
                  <Textarea rows={2} value={otherConditions} onChange={(e) => setOtherConditions(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Required Documents</CardTitle>
              <Button variant="outline" size="sm" onClick={addDoc}><Plus className="mr-1 h-3 w-3" />Add</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <Input className="flex-1" value={doc.name} onChange={(e) => updateDoc(i, "name", e.target.value)} placeholder="Document name" />
                  <div className="flex items-center gap-2">
                    <Switch checked={doc.required} onCheckedChange={(v) => updateDoc(i, "required", v)} />
                    <span className="text-xs text-muted-foreground">Required</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeDoc(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Process Steps */}
        <TabsContent value="process">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Process Steps</CardTitle>
              <Button variant="outline" size="sm" onClick={addStep}><Plus className="mr-1 h-3 w-3" />Add Step</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Step {i + 1}</Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeStep(i)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input value={step.title} onChange={(e) => updateStep(i, "title", e.target.value)} placeholder="Step title" />
                  <Textarea rows={2} value={step.description} onChange={(e) => updateStep(i, "description", e.target.value)} placeholder="Step description" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fees */}
        <TabsContent value="fees">
          <Card>
            <CardHeader><CardTitle>Fees & Timelines</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Service Fee</Label>
                  <Input type="number" value={serviceFee} onChange={(e) => setServiceFee(e.target.value)} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["USD", "CAD", "GBP", "EUR", "AUD", "NZD", "CHF"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Processing Time</Label>
                  <Input value={processingTime} onChange={(e) => setProcessingTime(e.target.value)} placeholder="e.g. 4-8 weeks" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={govFeesIncluded} onCheckedChange={setGovFeesIncluded} />
                <Label>Government fees included</Label>
              </div>
              <div className="space-y-2">
                <Label>Separate Costs</Label>
                <Textarea rows={2} value={separateCosts} onChange={(e) => setSeparateCosts(e.target.value)} placeholder="List any costs not included" />
              </div>
              <div className="space-y-2">
                <Label>Payment Note</Label>
                <Input value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} placeholder="e.g. No payment until plan is approved" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Extras */}
        <TabsContent value="extras">
          <div className="space-y-6">
            {/* Benefits */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Benefits / Highlights</CardTitle>
                <Button variant="outline" size="sm" onClick={addBenefit}><Plus className="mr-1 h-3 w-3" />Add</Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {benefits.map((b, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={b} onChange={(e) => { const n = [...benefits]; n[i] = e.target.value; setBenefits(n); }} placeholder="Benefit" />
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => setBenefits(benefits.filter((_, j) => j !== i))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* FAQs */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>FAQs</CardTitle>
                <Button variant="outline" size="sm" onClick={addFaq}><Plus className="mr-1 h-3 w-3" />Add</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="space-y-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">FAQ {i + 1}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFaq(i)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input value={faq.question} onChange={(e) => updateFaq(i, "question", e.target.value)} placeholder="Question" />
                    <Textarea rows={2} value={faq.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} placeholder="Answer" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Family & Included/Not Included */}
            <Card>
              <CardHeader><CardTitle>Additional Content</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Family / Dependant Option</Label>
                  <Textarea rows={2} value={familyOption} onChange={(e) => setFamilyOption(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>What's Included</Label>
                  {whatsIncluded.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={item} onChange={(e) => { const n = [...whatsIncluded]; n[i] = e.target.value; setWhatsIncluded(n); }} />
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => setWhatsIncluded(whatsIncluded.filter((_, j) => j !== i))}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addIncluded}><Plus className="mr-1 h-3 w-3" />Add</Button>
                </div>
                <div className="space-y-2">
                  <Label>What's Not Included</Label>
                  {whatsNotIncluded.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={item} onChange={(e) => { const n = [...whatsNotIncluded]; n[i] = e.target.value; setWhatsNotIncluded(n); }} />
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => setWhatsNotIncluded(whatsNotIncluded.filter((_, j) => j !== i))}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addNotIncluded}><Plus className="mr-1 h-3 w-3" />Add</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SEO & CTA */}
        <TabsContent value="seo">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Page title for search engines" />
                  <p className="text-xs text-muted-foreground">{metaTitle.length}/60 characters</p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea rows={2} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Page description for search engines" />
                  <p className="text-xs text-muted-foreground">{metaDescription.length}/160 characters</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>CTA Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Apply Button Text</Label>
                    <Input value={ctaApply} onChange={(e) => setCtaApply(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Consultation Button Text</Label>
                    <Input value={ctaConsult} onChange={(e) => setCtaConsult(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bottom save */}
      <div className="flex justify-end gap-2 pb-8">
        <Button variant="outline" onClick={onSuccess}>Cancel</Button>
        <Button variant="gold" onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />{saving ? "Saving..." : "Save Program"}
        </Button>
      </div>
    </div>
  );
}
