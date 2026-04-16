import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getUserApplications = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("applications")
      .select("id, reference_number, application_type, destination_country, status, payment_status, created_at, updated_at, form_data")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error("Failed to fetch applications");
    return { applications: data || [] };
  });

export const getUserPayments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("payments")
      .select("id, application_id, amount, currency, payment_status, internal_reference, service_type, country, visa_type, paid_at, created_at")
      .eq("applicant_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error("Failed to fetch payments");
    return { payments: data || [] };
  });

export const getAdminStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;

    const [appsRes, paymentsRes, agentsRes, programsRes] = await Promise.all([
      supabase.from("applications").select("id, status, payment_status, application_type, created_at", { count: "exact" }),
      supabase.from("payments").select("id, payment_status, amount, created_at"),
      supabase.from("user_roles").select("id", { count: "exact" }).eq("role", "agent"),
      supabase.from("programs").select("id", { count: "exact" }).eq("status", "active"),
    ]);

    const apps = appsRes.data || [];
    const payments = paymentsRes.data || [];
    const agentCount = agentsRes.count || 0;
    const programCount = programsRes.count || 0;

    const totalRevenue = payments
      .filter((p) => p.payment_status === "paid")
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const newAppsThisWeek = apps.filter((a) => new Date(a.created_at) >= weekAgo).length;
    const revenueThisMonth = payments
      .filter((p) => p.payment_status === "paid" && new Date(p.created_at) >= monthAgo)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const statusCounts: Record<string, number> = {};
    for (const a of apps) {
      statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    }

    const paymentStatusCounts: Record<string, number> = {};
    for (const p of payments) {
      paymentStatusCounts[p.payment_status] = (paymentStatusCounts[p.payment_status] || 0) + 1;
    }

    return {
      totalApplications: apps.length,
      newAppsThisWeek,
      statusCounts,
      agentCount,
      programCount,
      totalRevenue,
      revenueThisMonth,
      totalPayments: payments.length,
      paymentStatusCounts,
      recentApplications: apps.slice(0, 10),
    };
  });

export const getAdminRecentApplications = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("applications")
      .select("id, reference_number, application_type, destination_country, status, payment_status, form_data, created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    if (error) throw new Error("Failed to fetch recent applications");
    return { applications: data || [] };
  });
