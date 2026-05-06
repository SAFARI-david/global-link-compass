import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ArrowLeft, Upload, Loader2 } from "lucide-react";
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

interface BulkRow {
  id: string;
  name: string;
  country: string;
  visa_type: string;
  standard_price: string;
  processing_time: string;
}

function makeRow(): BulkRow {
  return { id: crypto.randomUUID(), name: "", country: "", visa_type: "", standard_price: "", processing_time: "" };
}

export function BulkServiceForm({ onSuccess }: { onSuccess: () => void }) {
  const [rows, setRows] = useState<BulkRow[]>([makeRow(), makeRow(), makeRow()]);
  const [saving, setSaving] = useState(false);

  function updateRow(id: string, field: keyof BulkRow, value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function addRow() {
    setRows((prev) => [...prev, makeRow()]);
  }

  async function handleSubmit() {
    const valid = rows.filter((r) => r.name.trim() && r.country && r.visa_type);
    if (valid.length === 0) {
      toast.error("Fill in at least one service with name, country, and visa type.");
      return;
    }

    setSaving(true);
    const records = valid.map((r) => ({
      name: r.name.trim(),
      slug: r.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      country: r.country,
      visa_type: r.visa_type,
      standard_price: r.standard_price ? Number(r.standard_price) : 0,
      processing_time: r.processing_time || null,
      status: "active" as const,
      is_active: true,
      form_fields: {},
    }));

    const { error } = await supabase.from("services").insert(records);
    setSaving(false);

    if (error) {
      toast.error("Failed to create services: " + error.message);
      return;
    }

    toast.success(`${records.length} service${records.length > 1 ? "s" : ""} created successfully!`);
    onSuccess();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Button variant="ghost" onClick={onSuccess} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bulk Add Services</CardTitle>
          <p className="text-sm text-muted-foreground">
            Quickly add multiple services at once. Fill in the essentials — you can edit details later.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Header row */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_140px_140px_100px_120px_40px] gap-2 text-xs font-medium text-muted-foreground px-1">
            <span>Service Name *</span>
            <span>Country *</span>
            <span>Visa Type *</span>
            <span>Price ($)</span>
            <span>Processing</span>
            <span />
          </div>

          {rows.map((row, i) => (
            <div key={row.id} className="grid gap-2 sm:grid-cols-[1fr_140px_140px_100px_120px_40px] items-start border-b border-border/40 pb-3 last:border-0 last:pb-0">
              <div>
                <Label className="sm:hidden text-xs mb-1">Service Name *</Label>
                <Input
                  placeholder={`e.g. Canada Work Visa`}
                  value={row.name}
                  onChange={(e) => updateRow(row.id, "name", e.target.value)}
                />
              </div>
              <div>
                <Label className="sm:hidden text-xs mb-1">Country *</Label>
                <Select value={row.country} onValueChange={(v) => updateRow(row.id, "country", v)}>
                  <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="sm:hidden text-xs mb-1">Visa Type *</Label>
                <Select value={row.visa_type} onValueChange={(v) => updateRow(row.id, "visa_type", v)}>
                  <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    {VISA_TYPES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="sm:hidden text-xs mb-1">Price ($)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={row.standard_price}
                  onChange={(e) => updateRow(row.id, "standard_price", e.target.value)}
                />
              </div>
              <div>
                <Label className="sm:hidden text-xs mb-1">Processing</Label>
                <Input
                  placeholder="e.g. 4–8 weeks"
                  value={row.processing_time}
                  onChange={(e) => updateRow(row.id, "processing_time", e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
                onClick={() => removeRow(row.id)}
                disabled={rows.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="mr-2 h-4 w-4" /> Add Another Row
            </Button>
            <p className="text-xs text-muted-foreground">
              {rows.filter((r) => r.name.trim() && r.country && r.visa_type).length} of {rows.length} ready
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onSuccess}>Cancel</Button>
            <Button variant="gold" onClick={handleSubmit} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Create {rows.filter((r) => r.name.trim() && r.country && r.visa_type).length} Services
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
