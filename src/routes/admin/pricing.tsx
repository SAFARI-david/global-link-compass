import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Edit, DollarSign, Tag, ToggleLeft, ToggleRight } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing Management — Admin" },
      { name: "description", content: "Manage service fees, add-ons, and program-linked pricing." },
    ],
  }),
  component: AdminPricingPage,
});

function AdminPricingPage() {
  const [pricing, setPricing] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pricingDialogOpen, setPricingDialogOpen] = useState(false);
  const [addonDialogOpen, setAddonDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    const [pRes, aRes] = await Promise.all([
      supabase.from("pricing").select("*").order("created_at", { ascending: false }),
      supabase.from("payment_addons").select("*").order("created_at", { ascending: false }),
    ]);
    setPricing(pRes.data || []);
    setAddons(aRes.data || []);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Pricing Management" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Tabs defaultValue="pricing">
            <TabsList>
              <TabsTrigger value="pricing">Service Pricing</TabsTrigger>
              <TabsTrigger value="addons">Add-ons</TabsTrigger>
            </TabsList>

            <TabsContent value="pricing" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Service Fees</CardTitle>
                  <Dialog open={pricingDialogOpen} onOpenChange={setPricingDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => setEditItem(null)}><Plus className="mr-1 h-4 w-4" /> Add Pricing</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>{editItem ? "Edit" : "Add"} Pricing</DialogTitle></DialogHeader>
                      <PricingForm item={editItem} onSave={() => { setPricingDialogOpen(false); loadAll(); }} />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
                  ) : pricing.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">No pricing records yet. Add your first service fee.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left text-muted-foreground">
                            <th className="pb-3 pr-4 font-medium">Service</th>
                            <th className="pb-3 pr-4 font-medium">Country</th>
                            <th className="pb-3 pr-4 font-medium">Visa Type</th>
                            <th className="pb-3 pr-4 font-medium">Amount</th>
                            <th className="pb-3 pr-4 font-medium">Whop Product</th>
                            <th className="pb-3 pr-4 font-medium">Active</th>
                            <th className="pb-3 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pricing.map((p) => (
                            <tr key={p.id} className="border-b border-border/50 last:border-0">
                              <td className="py-3 pr-4 font-medium">{p.service_name}</td>
                              <td className="py-3 pr-4">{p.country || "—"}</td>
                              <td className="py-3 pr-4">{p.visa_type || "—"}</td>
                              <td className="py-3 pr-4 font-semibold">${Number(p.base_amount).toFixed(2)} {p.currency}</td>
                              <td className="py-3 pr-4 font-mono text-xs">{p.whop_product_id || "—"}</td>
                              <td className="py-3 pr-4">{p.is_active ? <span className="text-green-600">Active</span> : <span className="text-muted-foreground">Inactive</span>}</td>
                              <td className="py-3">
                                <Button variant="ghost" size="sm" onClick={() => { setEditItem(p); setPricingDialogOpen(true); }}>
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addons" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Payment Add-ons</CardTitle>
                  <Dialog open={addonDialogOpen} onOpenChange={setAddonDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => setEditItem(null)}><Plus className="mr-1 h-4 w-4" /> Add Add-on</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>{editItem ? "Edit" : "Add"} Add-on</DialogTitle></DialogHeader>
                      <AddonForm item={editItem} onSave={() => { setAddonDialogOpen(false); loadAll(); }} />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {addons.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">No add-ons configured yet.</p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {addons.map((a) => (
                        <Card key={a.id} className={!a.is_active ? "opacity-50" : ""}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold">{a.name}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{a.description || "No description"}</p>
                              </div>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditItem(a); setAddonDialogOpen(true); }}>
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <p className="mt-2 text-lg font-bold">${Number(a.amount).toFixed(2)} <span className="text-xs font-normal text-muted-foreground">{a.currency}</span></p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function PricingForm({ item, onSave }: { item: any; onSave: () => void }) {
  const [form, setForm] = useState({
    service_name: item?.service_name || "",
    country: item?.country || "",
    visa_type: item?.visa_type || "",
    base_amount: item?.base_amount || "",
    currency: item?.currency || "USD",
    pricing_type: item?.pricing_type || "one_time",
    whop_product_id: item?.whop_product_id || "",
    whop_plan_id: item?.whop_plan_id || "",
    is_active: item?.is_active ?? true,
    notes: item?.notes || "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!form.service_name || !form.base_amount) { toast.error("Service name and amount are required"); return; }
    setSaving(true);
    try {
      const payload: any = { ...form, base_amount: Number(form.base_amount) };
      if (item?.id) {
        const { error } = await supabase.from("pricing").update(payload).eq("id", item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("pricing").insert(payload);
        if (error) throw error;
      }
      toast.success("Pricing saved");
      onSave();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  }

  return (
    <div className="space-y-3">
      <div><Label>Service Name *</Label><Input value={form.service_name} onChange={(e) => setForm({ ...form, service_name: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="e.g. Canada" /></div>
        <div><Label>Visa Type</Label><Input value={form.visa_type} onChange={(e) => setForm({ ...form, visa_type: e.target.value })} placeholder="e.g. Work Visa" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Amount *</Label><Input type="number" value={form.base_amount} onChange={(e) => setForm({ ...form, base_amount: e.target.value })} /></div>
        <div><Label>Currency</Label><Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Whop Product ID</Label><Input value={form.whop_product_id} onChange={(e) => setForm({ ...form, whop_product_id: e.target.value })} placeholder="Optional" /></div>
        <div><Label>Whop Plan ID</Label><Input value={form.whop_plan_id} onChange={(e) => setForm({ ...form, whop_plan_id: e.target.value })} placeholder="Optional" /></div>
      </div>
      <div><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
      <div className="flex items-center gap-2">
        <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
        <Label>Active</Label>
      </div>
      <Button className="w-full" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Pricing"}</Button>
    </div>
  );
}

function AddonForm({ item, onSave }: { item: any; onSave: () => void }) {
  const [form, setForm] = useState({
    name: item?.name || "",
    description: item?.description || "",
    amount: item?.amount || "",
    currency: item?.currency || "USD",
    is_active: item?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!form.name || !form.amount) { toast.error("Name and amount are required"); return; }
    setSaving(true);
    try {
      const payload: any = { ...form, amount: Number(form.amount) };
      if (item?.id) {
        const { error } = await supabase.from("payment_addons").update(payload).eq("id", item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("payment_addons").insert(payload);
        if (error) throw error;
      }
      toast.success("Add-on saved");
      onSave();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  }

  return (
    <div className="space-y-3">
      <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
      <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Amount *</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
        <div><Label>Currency</Label><Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} /></div>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
        <Label>Active</Label>
      </div>
      <Button className="w-full" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Add-on"}</Button>
    </div>
  );
}
