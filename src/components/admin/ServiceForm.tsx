import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
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

// Default form fields organized by step (matching the screenshot)
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
    { key: "dependant_details", label: "Enter details for each dependant below (individual fields will appear)", required: false, enabled: true },
    { key: "expected_travel_date", label: "Expected Travel Date (approx)", required: false, enabled: true },
    { key: "duration_of_stay", label: "Duration of Stay (optional)", required: false, enabled: false },
    { key: "purpose_of_travel", label: "Purpose of Travel (optional)", required: false, enabled: false },
    { key: "can_pay", label: "Are you able to pay the required service fee for this program?", required: true, enabled: true },
  ],
  "Step 6 — Additional & Declaration": [
    { key: "declaration", label: "I confirm all information is accurate. I understand that false information may result in application refusal.", required: true, enabled: true },
  ],
};

interface FormField {
  key: string;
  label: string;
  required: boolean;
  enabled: boolean;
}

interface Phase {
  name: string;
  amount: number;
}

interface ServiceFormProps {
  service?: any;
  onSuccess: () => void;
}

export function ServiceForm({ service, onSuccess }: ServiceFormProps) {
  const isEdit = !!service;

  const [country, setCountry] = useState(service?.country || "");
  const [visaType, setVisaType] = useState(service?.visa_type || "");
  const [description, setDescription] = useState(service?.description || "");
  const [requirements, setRequirements] = useState(
    (service?.requirements || []).join("\n")
  );
  const [formFields, setFormFields] = useState<Record<string, FormField[]>>(
    service?.form_fields && Object.keys(service.form_fields).length > 0
      ? service.form_fields
      : DEFAULT_FORM_FIELDS
  );
  const [standardPrice, setStandardPrice] = useState(service?.standard_price?.toString() || "0");
  const [partnerPrice, setPartnerPrice] = useState(service?.partner_price?.toString() || "");
  const [dependentPrice, setDependentPrice] = useState(service?.dependent_price?.toString() || "");
  const [processingTime, setProcessingTime] = useState(service?.processing_time || "");
  const [phases, setPhases] = useState<Phase[]>(service?.phases || []);
  const [internalNotes, setInternalNotes] = useState(service?.internal_notes || "");
  const [isActive, setIsActive] = useState(service?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(service?.is_featured ?? false);
  const [isHotDeal, setIsHotDeal] = useState(service?.is_hot_deal ?? false);
  const [saving, setSaving] = useState(false);

  function toggleField(step: string, idx: number, prop: "enabled" | "required", val: boolean) {
    setFormFields((prev) => {
      const next = { ...prev };
      next[step] = [...next[step]];
      next[step][idx] = { ...next[step][idx], [prop]: val };
      return next;
    });
  }

  function addPhase() {
    setPhases([...phases, { name: "", amount: 0 }]);
  }

  function removePhase(i: number) {
    setPhases(phases.filter((_, j) => j !== i));
  }

  function updatePhase(i: number, field: keyof Phase, val: string | number) {
    const next = [...phases];
    next[i] = { ...next[i], [field]: val };
    setPhases(next);
  }

  async function handleSave() {
    if (!country || !visaType) {
      toast.error("Country and Visa Type are required");
      return;
    }
    setSaving(true);

    const payload = {
      country,
      visa_type: visaType,
      description: description || null,
      requirements: requirements.split("\n").filter(Boolean),
      form_fields: formFields as unknown as any,
      standard_price: parseFloat(standardPrice) || 0,
      partner_price: partnerPrice ? parseFloat(partnerPrice) : null,
      dependent_price: dependentPrice ? parseFloat(dependentPrice) : null,
      processing_time: processingTime || null,
      phases: phases.filter((p) => p.name) as unknown as any,
      internal_notes: internalNotes || null,
      is_active: isActive,
      is_featured: isFeatured,
      is_hot_deal: isHotDeal,
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
              Configure the service, form fields, and pricing.
            </p>
          </div>
        </div>
        <Button variant="gold" onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader><CardTitle>Basic Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
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
              <Input value={visaType} onChange={(e) => setVisaType(e.target.value)} placeholder="Work Visa, Visit Visa, etc." />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Requirements (one per line)</Label>
            <Textarea rows={4} value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="Valid passport&#10;Job offer letter&#10;English proficiency" />
          </div>
        </CardContent>
      </Card>

      {/* Custom Application Form */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Application Form — All Steps (1–6)</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Choose which fields appear in each step when applicants apply for this service. Only sections with at least one field show "Apply Now". Applicants see only the steps and fields you select.
          </p>
          <p className="mt-2 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
            <strong>Tip:</strong> Select at least one field (e.g. in Step 1: Service, and Step 6: Declaration) and Save. You can customize every step.
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
                      <div className="flex items-center gap-1 mt-0.5">
                        <Badge
                          variant={field.required ? "default" : "secondary"}
                          className="text-[10px] px-1.5 py-0 cursor-pointer"
                          onClick={() => toggleField(stepName, idx, "required", !field.required)}
                        >
                          {field.required ? "Required" : "Optional"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Internal Notes */}
      <Card>
        <CardHeader><CardTitle>Internal Notes (optional)</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            rows={3}
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder="Notes or instructions for your team about this service's applications…"
          />
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader><CardTitle>Pricing & Processing</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Standard Price ($) — primary applicant cost when no phases</Label>
              <Input type="number" value={standardPrice} onChange={(e) => setStandardPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Processing Time</Label>
              <Input value={processingTime} onChange={(e) => setProcessingTime(e.target.value)} placeholder="4–6 weeks" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Partner Price ($)</Label>
              <Input type="number" value={partnerPrice} onChange={(e) => setPartnerPrice(e.target.value)} placeholder="Optional — agency / partner rate" />
              <p className="text-[11px] text-muted-foreground">Leave empty if same as standard or not used.</p>
            </div>
            <div className="space-y-2">
              <Label>Dependent Price ($)</Label>
              <Input type="number" value={dependentPrice} onChange={(e) => setDependentPrice(e.target.value)} placeholder="Optional — per spouse / child add-on" />
              <p className="text-[11px] text-muted-foreground">Optional fee per dependent on the same application.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phases */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Service Application Phases (pay per phase)</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Define phases for this service. Users pay when they reach each phase. Leave empty to use single price above.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={addPhase}>
            <Plus className="mr-1 h-3 w-3" /> Add Phase
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {phases.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No phases — single payment will apply.</p>
          ) : (
            phases.map((phase, i) => (
              <div key={i} className="flex items-center gap-3 rounded-md border p-3">
                <Badge variant="secondary" className="shrink-0">Phase {i + 1}</Badge>
                <Input
                  className="flex-1"
                  value={phase.name}
                  onChange={(e) => updatePhase(i, "name", e.target.value)}
                  placeholder="Phase name (e.g. Document Review)"
                />
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">$</span>
                  <Input
                    type="number"
                    className="w-24"
                    value={phase.amount}
                    onChange={(e) => updatePhase(i, "amount", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removePhase(i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Toggles */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-6 p-4">
          <div className="flex items-center gap-2">
            <Checkbox checked={isActive} onCheckedChange={(v) => setIsActive(!!v)} />
            <Label className="font-medium">Active</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={isFeatured} onCheckedChange={(v) => setIsFeatured(!!v)} />
            <Label className="font-medium">Featured</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={isHotDeal} onCheckedChange={(v) => setIsHotDeal(!!v)} />
            <Label className="font-medium text-destructive">🔥 Hot Deal</Label>
            <span className="text-xs text-muted-foreground">(shows archive)</span>
          </div>
        </CardContent>
      </Card>

      {/* Bottom save */}
      <Button variant="gold" size="lg" className="w-full" onClick={handleSave} disabled={saving}>
        <Save className="mr-2 h-4 w-4" />
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}
