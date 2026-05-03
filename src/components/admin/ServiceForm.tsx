import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Save, ArrowLeft, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const COUNTRIES = [
  "Canada", "United Kingdom", "Australia", "Germany", "United States",
  "France", "New Zealand", "Ireland", "Switzerland", "Netherlands",
  "United Arab Emirates", "Saudi Arabia", "Qatar", "Singapore",
];

const VISA_TYPES = [
  "Work Visa", "Visit Visa", "Study Visa", "Business Visa",
  "Family Visa", "Investment Visa", "Tourist Visa",
];

const DEFAULT_FORM_FIELDS: Record<string, FormField[]> = {
  "Step 1 — Service": [
    { key: "destination_country", label: "Destination Country", required: true, enabled: true },
    { key: "visa_type", label: "Visa Type", required: true, enabled: true },
    { key: "service_program", label: "Service / Program", required: false, enabled: true },
  ],
  "Step 2 — Personal": [
    { key: "full_name", label: "Full Name (as in passport)", required: true, enabled: true },
    { key: "date_of_birth", label: "Date of Birth", required: true, enabled: true },
    { key: "gender", label: "Gender", required: true, enabled: true },
    { key: "nationality", label: "Nationality", required: true, enabled: true },
    { key: "country_of_residence", label: "Country of Residence", required: true, enabled: true },
    { key: "city", label: "City", required: true, enabled: true },
    { key: "whatsapp_number", label: "WhatsApp Number", required: true, enabled: false },
    { key: "email_address", label: "Email Address", required: true, enabled: true },
    { key: "phone", label: "Phone (optional)", required: false, enabled: true },
    { key: "marital_status", label: "Marital Status", required: true, enabled: true },
  ],
  "Step 3 — Passport": [
    { key: "has_valid_passport", label: "Do you have a valid passport?", required: true, enabled: true },
    { key: "passport_number", label: "Passport Number", required: true, enabled: true },
    { key: "passport_expiry", label: "Passport Expiry Date", required: true, enabled: true },
    { key: "country_of_issue", label: "Country of Issue", required: true, enabled: true },
    { key: "passport_copy", label: "Upload Passport Copy (PDF, JPG, PNG — Max 5MB)", required: true, enabled: true },
  ],
  "Step 4 — Documents": [
    { key: "mandatory_documents", label: "Do you have all mandatory documents?", required: true, enabled: true },
    { key: "cv_resume", label: "CV / Resume (PDF, DOC, DOCX)", required: true, enabled: true },
    { key: "language_certificates", label: "Language Certificates (optional)", required: false, enabled: true },
    { key: "passport_photo", label: "Passport-Size Photo (JPG, PNG — Max 2MB)", required: true, enabled: true },
    { key: "current_occupation", label: "Current Occupation", required: true, enabled: true },
    { key: "years_of_experience", label: "Years of Experience", required: true, enabled: true },
    { key: "field_industry", label: "Field / Industry", required: true, enabled: true },
    { key: "preferred_job_sector", label: "Preferred Job Sector", required: true, enabled: true },
    { key: "current_employer", label: "Current / Prospective Employer Details", required: false, enabled: true },
    { key: "language_level_english", label: "Language Level (English)", required: true, enabled: true },
    { key: "language_level_french", label: "Language Level (French)", required: false, enabled: true },
    { key: "intended_country", label: "Intended Country / Program", required: false, enabled: true },
    { key: "preferred_intake", label: "Preferred Intake", required: false, enabled: true },
    { key: "sponsor", label: "Who will sponsor your study?", required: false, enabled: false },
    { key: "financial_statement", label: "Financial / Bank Statement Details", required: false, enabled: true },
    { key: "purpose_of_visit", label: "Purpose of Visit", required: false, enabled: false },
    { key: "workforce_family", label: "Workforce Details of Family", required: false, enabled: false },
    { key: "travel_history", label: "Travel History", required: false, enabled: false },
    { key: "previous_applications", label: "Previous Visa Applications / Refusals", required: false, enabled: false },
    { key: "destination_city", label: "Intended Destination City", required: false, enabled: false },
    { key: "additional_notes", label: "Additional Notes", required: false, enabled: true },
  ],
  "Step 5 — Dependants & Payment": [
    { key: "has_dependants", label: "Do you have dependants?", required: true, enabled: true },
    { key: "dependants_count", label: "dependants_count", required: false, enabled: true },
    { key: "dependant_details", label: "Enter details for each dependant below", required: false, enabled: true },
    { key: "expected_travel_date", label: "Expected Travel Date (approx)", required: false, enabled: true },
    { key: "duration_of_stay", label: "Duration of Stay (optional)", required: false, enabled: false },
    { key: "purpose_of_travel", label: "Purpose of Travel (optional)", required: false, enabled: false },
    { key: "can_pay", label: "Are you able to pay the required service fee?", required: true, enabled: true },
  ],
  "Step 6 — Additional & Declaration": [
    { key: "declaration", label: "I confirm all information is accurate.", required: true, enabled: true },
  ],
};

interface FormField { key: string; label: string; required: boolean; enabled: boolean; }
interface Phase { name: string; amount: number; }
interface DocItem { name: string; required: boolean; }
interface StepItem { title: string; description: string; order: number; }
interface FaqItem { question: string; answer: string; }

interface ServiceFormProps { service?: any; onSuccess: () => void; }

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function ServiceForm({ service, onSuccess }: ServiceFormProps) {
  const isEdit = !!service;

  // Basic
  const [name, setName] = useState(service?.name || "");
  const [slug, setSlug] = useState(service?.slug || "");
  const [country, setCountry] = useState(service?.country || "");
  const [visaType, setVisaType] = useState(service?.visa_type || "");
  const [category, setCategory] = useState(service?.category || "");
  const [tagline, setTagline] = useState(service?.tagline || "");
  const [description, setDescription] = useState(service?.description || "");
  const [status, setStatus] = useState(service?.status || "active");
  const [isActive, setIsActive] = useState(service?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(service?.is_featured ?? false);
  const [isHotDeal, setIsHotDeal] = useState(service?.is_hot_deal ?? false);

  // Overview
  const [shortOverview, setShortOverview] = useState(service?.short_overview || "");
  const [fullDescription, setFullDescription] = useState(service?.full_description || "");
  const [whyChoose, setWhyChoose] = useState(service?.why_choose || "");
  const [bestFor, setBestFor] = useState(service?.best_for || "");

  // Eligibility
  const [eligibilitySummary, setEligibilitySummary] = useState(service?.eligibility_summary || "");
  const [educationReq, setEducationReq] = useState(service?.education_requirement || "");
  const [workExpReq, setWorkExpReq] = useState(service?.work_experience_requirement || "");
  const [languageReq, setLanguageReq] = useState(service?.language_requirement || "");
  const [otherConditions, setOtherConditions] = useState(service?.other_conditions || "");

  // Requirements (text array)
  const [requirements, setRequirements] = useState((service?.requirements || []).join("\n"));

  // Required Documents (jsonb)
  const [documents, setDocuments] = useState<DocItem[]>(service?.required_documents || [{ name: "", required: true }]);

  // Process Steps
  const [steps, setSteps] = useState<StepItem[]>(service?.process_steps || [{ title: "", description: "", order: 1 }]);

  // Benefits
  const [benefits, setBenefits] = useState<string[]>(service?.benefits || [""]);

  // FAQs
  const [faqs, setFaqs] = useState<FaqItem[]>(service?.faqs || [{ question: "", answer: "" }]);

  // Form Fields
  const [formFields, setFormFields] = useState<Record<string, FormField[]>>(
    service?.form_fields && Object.keys(service.form_fields).length > 0
      ? service.form_fields
      : DEFAULT_FORM_FIELDS
  );

  // Pricing
  const [standardPrice, setStandardPrice] = useState(service?.standard_price?.toString() || "0");
  const [partnerPrice, setPartnerPrice] = useState(service?.partner_price?.toString() || "");
  const [dependentPrice, setDependentPrice] = useState(service?.dependent_price?.toString() || "");
  const [currency, setCurrency] = useState(service?.currency || "USD");
  const [processingTime, setProcessingTime] = useState(service?.processing_time || "");
  const [govFeesIncluded, setGovFeesIncluded] = useState(service?.government_fees_included || false);
  const [separateCosts, setSeparateCosts] = useState(service?.separate_costs || "");
  const [paymentNote, setPaymentNote] = useState(service?.payment_note || "");
  const [phases, setPhases] = useState<Phase[]>(service?.phases || []);

  // Extras
  const [familyOption, setFamilyOption] = useState(service?.family_dependant_option || "");
  const [whatsIncluded, setWhatsIncluded] = useState<string[]>(service?.whats_included || [""]);
  const [whatsNotIncluded, setWhatsNotIncluded] = useState<string[]>(service?.whats_not_included || [""]);

  // SEO & CTA
  const [metaTitle, setMetaTitle] = useState(service?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(service?.meta_description || "");
  const [ctaApply, setCtaApply] = useState(service?.cta_apply_text || "Apply Now");
  const [ctaConsult, setCtaConsult] = useState(service?.cta_consult_text || "Book Consultation");

  const [internalNotes, setInternalNotes] = useState(service?.internal_notes || "");
  const [saving, setSaving] = useState(false);

  const handleNameChange = (v: string) => { setName(v); if (!isEdit) setSlug(slugify(v)); };

  function toggleField(step: string, idx: number, prop: "enabled" | "required", val: boolean) {
    setFormFields((prev) => {
      const next = { ...prev };
      next[step] = [...next[step]];
      next[step][idx] = { ...next[step][idx], [prop]: val };
      return next;
    });
  }

  function addPhase() { setPhases([...phases, { name: "", amount: 0 }]); }
  function removePhase(i: number) { setPhases(phases.filter((_, j) => j !== i)); }
  function updatePhase(i: number, field: keyof Phase, val: string | number) {
    const next = [...phases]; next[i] = { ...next[i], [field]: val }; setPhases(next);
  }

  const addDoc = () => setDocuments([...documents, { name: "", required: true }]);
  const removeDoc = (i: number) => setDocuments(documents.filter((_, j) => j !== i));
  const updateDoc = (i: number, field: string, val: any) => {
    const next = [...documents]; (next[i] as any)[field] = val; setDocuments(next);
  };

  const addStep = () => setSteps([...steps, { title: "", description: "", order: steps.length + 1 }]);
  const removeStep = (i: number) => setSteps(steps.filter((_, j) => j !== i));
  const updateStep = (i: number, field: string, val: string) => {
    const next = [...steps]; (next[i] as any)[field] = val; setSteps(next);
  };

  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);
  const removeFaq = (i: number) => setFaqs(faqs.filter((_, j) => j !== i));
  const updateFaq = (i: number, field: string, val: string) => {
    const next = [...faqs]; (next[i] as any)[field] = val; setFaqs(next);
  };

  const addBenefit = () => setBenefits([...benefits, ""]);
  const addIncluded = () => setWhatsIncluded([...whatsIncluded, ""]);
  const addNotIncluded = () => setWhatsNotIncluded([...whatsNotIncluded, ""]);

  async function handleSave() {
    if (!country || !visaType) { toast.error("Country and Visa Type are required"); return; }
    setSaving(true);

    const payload = {
      name: name || null,
      slug: slug || null,
      country,
      visa_type: visaType,
      category: category || null,
      tagline: tagline || null,
      description: description || null,
      status,
      is_active: isActive,
      is_featured: isFeatured,
      is_hot_deal: isHotDeal,
      short_overview: shortOverview || null,
      full_description: fullDescription || null,
      why_choose: whyChoose || null,
      best_for: bestFor || null,
      eligibility_summary: eligibilitySummary || null,
      education_requirement: educationReq || null,
      work_experience_requirement: workExpReq || null,
      language_requirement: languageReq || null,
      other_conditions: otherConditions || null,
      requirements: requirements.split("\n").filter(Boolean),
      required_documents: documents.filter((d) => d.name) as unknown as any,
      process_steps: steps.filter((s) => s.title).map((s, i) => ({ ...s, order: i + 1 })) as unknown as any,
      benefits: benefits.filter(Boolean) as unknown as any,
      faqs: faqs.filter((f) => f.question) as unknown as any,
      form_fields: formFields as unknown as any,
      standard_price: parseFloat(standardPrice) || 0,
      partner_price: partnerPrice ? parseFloat(partnerPrice) : null,
      dependent_price: dependentPrice ? parseFloat(dependentPrice) : null,
      currency,
      processing_time: processingTime || null,
      government_fees_included: govFeesIncluded,
      separate_costs: separateCosts || null,
      payment_note: paymentNote || null,
      phases: phases.filter((p) => p.name) as unknown as any,
      family_dependant_option: familyOption || null,
      whats_included: whatsIncluded.filter(Boolean) as unknown as any,
      whats_not_included: whatsNotIncluded.filter(Boolean) as unknown as any,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      cta_apply_text: ctaApply,
      cta_consult_text: ctaConsult,
      internal_notes: internalNotes || null,
    };

    try {
      if (isEdit) {
        const { error } = await supabase.from("services").update(payload).eq("id", service.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services").insert(payload);
        if (error) throw error;
      }
      toast.success(isEdit ? "Service updated" : "Service created");
      onSuccess();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between rounded-lg border bg-card p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onSuccess}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold font-heading">
              {isEdit ? "Edit Service" : "Add Service"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure every aspect of this service — details, eligibility, pricing, form fields, and SEO.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onSuccess}>Cancel</Button>
          <Button variant="gold" onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="form">Form Fields</TabsTrigger>
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
                  <Label>Service Name</Label>
                  <Input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Canada Work Visa — LMIA" />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated from name" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                    <SelectContent>{COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Visa Type *</Label>
                  <Select value={visaType} onValueChange={setVisaType}>
                    <SelectTrigger><SelectValue placeholder="Select visa type" /></SelectTrigger>
                    <SelectContent>{VISA_TYPES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Employer-Sponsored" />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Brief one-liner" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap items-center gap-6 pt-6">
                  <div className="flex items-center gap-2">
                    <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                    <Label>Featured</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={isHotDeal} onCheckedChange={setIsHotDeal} />
                    <Label className="text-destructive">🔥 Hot Deal</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Requirements (one per line)</Label>
                <Textarea rows={4} value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="Valid passport&#10;Job offer letter&#10;English proficiency" />
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
                <Textarea rows={3} value={shortOverview} onChange={(e) => setShortOverview(e.target.value)} placeholder="Brief summary shown in cards and listings" />
              </div>
              <div className="space-y-2">
                <Label>Full Description</Label>
                <Textarea rows={6} value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} placeholder="Detailed description for the service page" />
              </div>
              <div className="space-y-2">
                <Label>Why Choose This Service</Label>
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
            <CardHeader><CardTitle>Pricing & Processing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Standard Price ($)</Label>
                  <Input type="number" value={standardPrice} onChange={(e) => setStandardPrice(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                      <SelectItem value="AUD">AUD</SelectItem>
                      <SelectItem value="AED">AED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Processing Time</Label>
                  <Input value={processingTime} onChange={(e) => setProcessingTime(e.target.value)} placeholder="4–6 weeks" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Partner Price ($)</Label>
                  <Input type="number" value={partnerPrice} onChange={(e) => setPartnerPrice(e.target.value)} placeholder="Agency / partner rate" />
                </div>
                <div className="space-y-2">
                  <Label>Dependent Price ($)</Label>
                  <Input type="number" value={dependentPrice} onChange={(e) => setDependentPrice(e.target.value)} placeholder="Per spouse / child add-on" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={govFeesIncluded} onCheckedChange={setGovFeesIncluded} />
                <Label>Government Fees Included</Label>
              </div>
              <div className="space-y-2">
                <Label>Separate Costs (not included)</Label>
                <Textarea rows={2} value={separateCosts} onChange={(e) => setSeparateCosts(e.target.value)} placeholder="e.g. Embassy fees, medical exam" />
              </div>
              <div className="space-y-2">
                <Label>Payment Note</Label>
                <Input value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} placeholder="e.g. Payment plans available" />
              </div>

              {/* Phases */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-sm">Service Phases (pay per phase)</h4>
                    <p className="text-xs text-muted-foreground">Leave empty to use single price above.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={addPhase}><Plus className="mr-1 h-3 w-3" /> Add Phase</Button>
                </div>
                {phases.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No phases — single payment will apply.</p>
                ) : (
                  <div className="space-y-3">
                    {phases.map((phase, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-md border p-3">
                        <Badge variant="secondary" className="shrink-0">Phase {i + 1}</Badge>
                        <Input className="flex-1" value={phase.name} onChange={(e) => updatePhase(i, "name", e.target.value)} placeholder="Phase name" />
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-muted-foreground">$</span>
                          <Input type="number" className="w-24" value={phase.amount} onChange={(e) => updatePhase(i, "amount", parseFloat(e.target.value) || 0)} />
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removePhase(i)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Form Fields */}
        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>Custom Application Form — All Steps (1–6)</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Choose which fields appear in each step when applicants apply.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(formFields).map(([stepName, fields]) => (
                <div key={stepName} className="rounded-lg border p-4">
                  <h4 className="font-semibold text-sm mb-3">{stepName}</h4>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {fields.map((field, idx) => (
                      <div key={field.key} className="flex items-start gap-2">
                        <Checkbox
                          checked={field.enabled}
                          onCheckedChange={(v) => toggleField(stepName, idx, "enabled", !!v)}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs leading-tight block">{field.label}</span>
                          <Badge
                            variant={field.required ? "default" : "secondary"}
                            className="text-[10px] px-1.5 py-0 cursor-pointer mt-0.5"
                            onClick={() => toggleField(stepName, idx, "required", !field.required)}
                          >
                            {field.required ? "Required" : "Optional"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Extras */}
        <TabsContent value="extras">
          <div className="space-y-6">
            {/* Benefits */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Benefits</CardTitle>
                <Button variant="outline" size="sm" onClick={addBenefit}><Plus className="mr-1 h-3 w-3" />Add</Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {benefits.map((b, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={b} onChange={(e) => { const n = [...benefits]; n[i] = e.target.value; setBenefits(n); }} placeholder="Benefit" />
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-destructive" onClick={() => setBenefits(benefits.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button>
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
                  <div key={i} className="rounded-lg border p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">FAQ {i + 1}</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFaq(i)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    <Input value={faq.question} onChange={(e) => updateFaq(i, "question", e.target.value)} placeholder="Question" />
                    <Textarea rows={2} value={faq.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} placeholder="Answer" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Family & Inclusions */}
            <Card>
              <CardHeader><CardTitle>Family & Inclusions</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Family / Dependant Option</Label>
                  <Input value={familyOption} onChange={(e) => setFamilyOption(e.target.value)} placeholder="e.g. Spouse and children under 18 can apply" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>What's Included</Label>
                      <Button variant="ghost" size="sm" onClick={addIncluded}><Plus className="h-3 w-3" /></Button>
                    </div>
                    {whatsIncluded.map((item, i) => (
                      <div key={i} className="flex gap-2">
                        <Input value={item} onChange={(e) => { const n = [...whatsIncluded]; n[i] = e.target.value; setWhatsIncluded(n); }} placeholder="Included item" />
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-destructive" onClick={() => setWhatsIncluded(whatsIncluded.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>What's Not Included</Label>
                      <Button variant="ghost" size="sm" onClick={addNotIncluded}><Plus className="h-3 w-3" /></Button>
                    </div>
                    {whatsNotIncluded.map((item, i) => (
                      <div key={i} className="flex gap-2">
                        <Input value={item} onChange={(e) => { const n = [...whatsNotIncluded]; n[i] = e.target.value; setWhatsNotIncluded(n); }} placeholder="Not included item" />
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-destructive" onClick={() => setWhatsNotIncluded(whatsNotIncluded.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Internal Notes */}
            <Card>
              <CardHeader><CardTitle>Internal Notes (optional)</CardTitle></CardHeader>
              <CardContent>
                <Textarea rows={3} value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} placeholder="Notes or instructions for your team…" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SEO & CTA */}
        <TabsContent value="seo">
          <Card>
            <CardHeader><CardTitle>SEO & Call-to-Action</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Page title for search engines" />
                <p className="text-[11px] text-muted-foreground">{metaTitle.length}/60 characters</p>
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea rows={2} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Page description for search engines" />
                <p className="text-[11px] text-muted-foreground">{metaDescription.length}/160 characters</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>CTA Apply Button Text</Label>
                  <Input value={ctaApply} onChange={(e) => setCtaApply(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>CTA Consult Button Text</Label>
                  <Input value={ctaConsult} onChange={(e) => setCtaConsult(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom save */}
      <Button variant="gold" size="lg" className="w-full" onClick={handleSave} disabled={saving}>
        <Save className="mr-2 h-4 w-4" />
        {saving ? "Saving…" : "Save Service"}
      </Button>
    </div>
  );
}
