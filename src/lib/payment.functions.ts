import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getPaymentByApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { applicationId: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: payment, error } = await supabase
      .from("payments")
      .select("*")
      .eq("application_id", data.applicationId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error("Failed to fetch payment: " + error.message);
    return { payment };
  });

export const getApplicationForPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { applicationId: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: application, error } = await supabase
      .from("applications")
      .select("id, reference_number, application_type, destination_country, form_data, status, payment_status, created_at")
      .eq("id", data.applicationId)
      .single();
    if (error) throw new Error("Application not found");
    return { application };
  });

export const createPaymentRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    applicationId: string;
    amount: number;
    currency: string;
    country: string;
    visaType: string;
    serviceType: string;
    programId?: string;
    payerType?: string;
  }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: payment, error } = await supabase
      .from("payments")
      .insert({
        application_id: data.applicationId,
        applicant_id: userId,
        payer_type: (data.payerType || "applicant") as any,
        country: data.country,
        visa_type: data.visaType,
        service_type: data.serviceType,
        program_id: data.programId || null,
        amount: data.amount,
        currency: data.currency,
        internal_reference: "",
      } as any)
      .select("*")
      .single();
    if (error) throw new Error("Failed to create payment: " + error.message);
    return { payment };
  });

export const getPricingForService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { country?: string; visaType?: string; programId?: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    let query = supabase.from("pricing").select("*").eq("is_active", true);
    if (data.country) query = query.eq("country", data.country);
    if (data.visaType) query = query.eq("visa_type", data.visaType);
    if (data.programId) query = query.eq("program_id", data.programId);
    const { data: pricing, error } = await query;
    if (error) throw new Error("Failed to fetch pricing");
    return { pricing: pricing || [] };
  });

export const getActiveAddons = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data: addons, error } = await supabase
      .from("payment_addons")
      .select("*")
      .eq("is_active", true);
    if (error) throw new Error("Failed to fetch addons");
    return { addons: addons || [] };
  });

// Admin functions
export const getAllPayments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { status?: string; search?: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    let query = supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });
    if (data.status && data.status !== "all") {
      query = query.eq("payment_status", data.status as any);
    }
    const { data: payments, error } = await query;
    if (error) throw new Error("Failed to fetch payments");
    return { payments: payments || [] };
  });

export const updatePaymentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { paymentId: string; status: string; notes?: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const updateObj: any = { payment_status: data.status };
    if (data.status === "paid") updateObj.paid_at = new Date().toISOString();
    if (data.notes) updateObj.notes = data.notes;
    const { error } = await supabase
      .from("payments")
      .update(updateObj as any)
      .eq("id", data.paymentId);
    if (error) throw new Error("Failed to update payment");
    return { success: true };
  });

export const getAllPricing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data: pricing, error } = await supabase
      .from("pricing")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Failed to fetch pricing");
    return { pricing: pricing || [] };
  });

export const upsertPricing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    id?: string;
    country?: string;
    visa_type?: string;
    program_id?: string;
    service_name: string;
    base_amount: number;
    currency: string;
    pricing_type: string;
    whop_product_id?: string;
    whop_plan_id?: string;
    is_active: boolean;
    notes?: string;
  }) => data)
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    if (data.id) {
      const { error } = await supabase.from("pricing").update(data as any).eq("id", data.id);
      if (error) throw new Error("Failed to update pricing");
    } else {
      const { error } = await supabase.from("pricing").insert(data as any);
      if (error) throw new Error("Failed to create pricing");
    }
    return { success: true };
  });

export const getAllAddons = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data: addons, error } = await supabase
      .from("payment_addons")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Failed to fetch addons");
    return { addons: addons || [] };
  });

export const upsertAddon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    id?: string;
    name: string;
    description?: string;
    amount: number;
    currency: string;
    is_active: boolean;
  }) => data)
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    if (data.id) {
      const { error } = await supabase.from("payment_addons").update(data as any).eq("id", data.id);
      if (error) throw new Error("Failed to update addon");
    } else {
      const { error } = await supabase.from("payment_addons").insert(data as any);
      if (error) throw new Error("Failed to create addon");
    }
    return { success: true };
  });
