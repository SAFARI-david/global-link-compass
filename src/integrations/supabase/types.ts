export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          admin_notes: string | null
          application_type: string
          assigned_agent_id: string | null
          created_at: string
          destination_country: string | null
          form_data: Json
          id: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          reference_number: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          application_type: string
          assigned_agent_id?: string | null
          created_at?: string
          destination_country?: string | null
          form_data?: Json
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          reference_number: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          application_type?: string
          assigned_agent_id?: string | null
          created_at?: string
          destination_country?: string | null
          form_data?: Json
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          reference_number?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      commission_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      commissions: {
        Row: {
          agent_id: string
          application_id: string | null
          approved_by: string | null
          commission_amount: number
          commission_percentage: number
          created_at: string
          id: string
          notes: string | null
          paid_at: string | null
          payment_id: string | null
          status: Database["public"]["Enums"]["commission_status"]
          total_payment_amount: number
          updated_at: string
        }
        Insert: {
          agent_id: string
          application_id?: string | null
          approved_by?: string | null
          commission_amount: number
          commission_percentage?: number
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_id?: string | null
          status?: Database["public"]["Enums"]["commission_status"]
          total_payment_amount: number
          updated_at?: string
        }
        Update: {
          agent_id?: string
          application_id?: string | null
          approved_by?: string | null
          commission_amount?: number
          commission_percentage?: number
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_id?: string | null
          status?: Database["public"]["Enums"]["commission_status"]
          total_payment_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "agent_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: true
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          admin_notes: string | null
          application_id: string
          created_at: string
          document_type: string
          file_name: string
          file_path: string
          file_size: number
          id: string
          mime_type: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["document_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          application_id: string
          created_at?: string
          document_type: string
          file_name: string
          file_path: string
          file_size?: number
          id?: string
          mime_type?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          application_id?: string
          created_at?: string
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          mime_type?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          converted: boolean
          created_at: string
          email: string
          form_data: Json
          id: string
          name: string
          source: string
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          converted?: boolean
          created_at?: string
          email: string
          form_data?: Json
          id?: string
          name: string
          source: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          converted?: boolean
          created_at?: string
          email?: string
          form_data?: Json
          id?: string
          name?: string
          source?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      payment_addons: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          agent_id: string | null
          amount: number
          applicant_id: string | null
          application_id: string | null
          country: string | null
          created_at: string
          currency: string
          id: string
          internal_reference: string
          notes: string | null
          paid_at: string | null
          payer_type: Database["public"]["Enums"]["payer_type"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          program_id: string | null
          provider: string
          service_type: string | null
          updated_at: string
          verification_method: string | null
          visa_type: string | null
          whop_checkout_reference: string | null
          whop_payment_id: string | null
          whop_plan_id: string | null
          whop_product_id: string | null
        }
        Insert: {
          agent_id?: string | null
          amount: number
          applicant_id?: string | null
          application_id?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          id?: string
          internal_reference: string
          notes?: string | null
          paid_at?: string | null
          payer_type?: Database["public"]["Enums"]["payer_type"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          program_id?: string | null
          provider?: string
          service_type?: string | null
          updated_at?: string
          verification_method?: string | null
          visa_type?: string | null
          whop_checkout_reference?: string | null
          whop_payment_id?: string | null
          whop_plan_id?: string | null
          whop_product_id?: string | null
        }
        Update: {
          agent_id?: string | null
          amount?: number
          applicant_id?: string | null
          application_id?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          id?: string
          internal_reference?: string
          notes?: string | null
          paid_at?: string | null
          payer_type?: Database["public"]["Enums"]["payer_type"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          program_id?: string | null
          provider?: string
          service_type?: string | null
          updated_at?: string
          verification_method?: string | null
          visa_type?: string | null
          whop_checkout_reference?: string | null
          whop_payment_id?: string | null
          whop_plan_id?: string | null
          whop_product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "agent_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing: {
        Row: {
          base_amount: number
          country: string | null
          created_at: string
          currency: string
          id: string
          is_active: boolean
          notes: string | null
          pricing_type: string
          program_id: string | null
          service_name: string
          updated_at: string
          visa_type: string | null
          whop_plan_id: string | null
          whop_product_id: string | null
        }
        Insert: {
          base_amount: number
          country?: string | null
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          pricing_type?: string
          program_id?: string | null
          service_name: string
          updated_at?: string
          visa_type?: string | null
          whop_plan_id?: string | null
          whop_product_id?: string | null
        }
        Update: {
          base_amount?: number
          country?: string | null
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          pricing_type?: string
          program_id?: string | null
          service_name?: string
          updated_at?: string
          visa_type?: string | null
          whop_plan_id?: string | null
          whop_product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country_of_residence: string | null
          created_at: string
          full_name: string | null
          id: string
          nationality: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          country_of_residence?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          nationality?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          country_of_residence?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          nationality?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          benefits: Json | null
          best_for: string | null
          category: string | null
          country: string
          created_at: string
          cta_apply_text: string | null
          cta_consult_text: string | null
          currency: string | null
          education_requirement: string | null
          eligibility_summary: string | null
          family_dependant_option: string | null
          faqs: Json | null
          featured: boolean
          full_description: string | null
          government_fees_included: boolean | null
          id: string
          language_requirement: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          other_conditions: string | null
          payment_note: string | null
          process_steps: Json | null
          processing_time: string | null
          required_documents: Json | null
          separate_costs: string | null
          service_fee: number | null
          short_overview: string | null
          slug: string
          status: string
          tagline: string | null
          updated_at: string
          visa_type: string
          whats_included: Json | null
          whats_not_included: Json | null
          why_choose: string | null
          work_experience_requirement: string | null
        }
        Insert: {
          benefits?: Json | null
          best_for?: string | null
          category?: string | null
          country: string
          created_at?: string
          cta_apply_text?: string | null
          cta_consult_text?: string | null
          currency?: string | null
          education_requirement?: string | null
          eligibility_summary?: string | null
          family_dependant_option?: string | null
          faqs?: Json | null
          featured?: boolean
          full_description?: string | null
          government_fees_included?: boolean | null
          id?: string
          language_requirement?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          other_conditions?: string | null
          payment_note?: string | null
          process_steps?: Json | null
          processing_time?: string | null
          required_documents?: Json | null
          separate_costs?: string | null
          service_fee?: number | null
          short_overview?: string | null
          slug: string
          status?: string
          tagline?: string | null
          updated_at?: string
          visa_type: string
          whats_included?: Json | null
          whats_not_included?: Json | null
          why_choose?: string | null
          work_experience_requirement?: string | null
        }
        Update: {
          benefits?: Json | null
          best_for?: string | null
          category?: string | null
          country?: string
          created_at?: string
          cta_apply_text?: string | null
          cta_consult_text?: string | null
          currency?: string | null
          education_requirement?: string | null
          eligibility_summary?: string | null
          family_dependant_option?: string | null
          faqs?: Json | null
          featured?: boolean
          full_description?: string | null
          government_fees_included?: boolean | null
          id?: string
          language_requirement?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          other_conditions?: string | null
          payment_note?: string | null
          process_steps?: Json | null
          processing_time?: string | null
          required_documents?: Json | null
          separate_costs?: string | null
          service_fee?: number | null
          short_overview?: string | null
          slug?: string
          status?: string
          tagline?: string | null
          updated_at?: string
          visa_type?: string
          whats_included?: Json | null
          whats_not_included?: Json | null
          why_choose?: string | null
          work_experience_requirement?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          error_message: string | null
          event_type: string
          external_event_id: string | null
          id: string
          payload_json: Json
          processed: boolean
          processed_at: string | null
          provider: string
          signature_valid: boolean
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_type: string
          external_event_id?: string | null
          id?: string
          payload_json?: Json
          processed?: boolean
          processed_at?: string | null
          provider?: string
          signature_valid?: boolean
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_type?: string
          external_event_id?: string | null
          id?: string
          payload_json?: Json
          processed?: boolean
          processed_at?: string | null
          provider?: string
          signature_valid?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      agent_applications: {
        Row: {
          application_type: string | null
          assigned_agent_id: string | null
          created_at: string | null
          destination_country: string | null
          form_data: Json | null
          id: string | null
          reference_number: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          application_type?: string | null
          assigned_agent_id?: string | null
          created_at?: string | null
          destination_country?: string | null
          form_data?: Json | null
          id?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          application_type?: string | null
          assigned_agent_id?: string | null
          created_at?: string | null
          destination_country?: string | null
          form_data?: Json | null
          id?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "agent" | "applicant"
      application_status:
        | "submitted"
        | "under_review"
        | "in_progress"
        | "pending_documents"
        | "approved"
        | "rejected"
      commission_status: "pending" | "approved" | "paid" | "rejected"
      document_status: "pending" | "approved" | "rejected"
      payer_type: "applicant" | "agent"
      payment_status:
        | "unpaid"
        | "pending"
        | "paid"
        | "failed"
        | "refunded"
        | "pending_verification"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "agent", "applicant"],
      application_status: [
        "submitted",
        "under_review",
        "in_progress",
        "pending_documents",
        "approved",
        "rejected",
      ],
      commission_status: ["pending", "approved", "paid", "rejected"],
      document_status: ["pending", "approved", "rejected"],
      payer_type: ["applicant", "agent"],
      payment_status: [
        "unpaid",
        "pending",
        "paid",
        "failed",
        "refunded",
        "pending_verification",
      ],
    },
  },
} as const
