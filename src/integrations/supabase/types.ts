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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          address: string
          created_at: string
          customer_id: string
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string | null
          provider_id: string
          provider_service_id: string
          scheduled_date: string | null
          scheduled_time: string | null
          status: string
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          customer_id: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          provider_id: string
          provider_service_id: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          customer_id?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          provider_id?: string
          provider_service_id?: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_provider_service_id_fkey"
            columns: ["provider_service_id"]
            isOneToOne: false
            referencedRelation: "provider_services"
            referencedColumns: ["id"]
          },
        ]
      }
      home_page_images: {
        Row: {
          alt_text: string
          created_at: string
          created_by: string | null
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          alt_text: string
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      master_services: {
        Row: {
          base_price_range: string | null
          category: string
          category_id: string | null
          created_at: string
          description: string | null
          estimated_time: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          base_price_range?: string | null
          category: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          estimated_time?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          base_price_range?: string | null
          category?: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          estimated_time?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "master_services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_verifications: {
        Row: {
          created_at: string
          email: string | null
          expires_at: string
          id: string
          otp_code: string
          phone: string | null
          verified: boolean
        }
        Insert: {
          created_at?: string
          email?: string | null
          expires_at: string
          id?: string
          otp_code: string
          phone?: string | null
          verified?: boolean
        }
        Update: {
          created_at?: string
          email?: string | null
          expires_at?: string
          id?: string
          otp_code?: string
          phone?: string | null
          verified?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          is_available: boolean | null
          location: string | null
          profile_picture_url: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          is_available?: boolean | null
          location?: string | null
          profile_picture_url?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          is_available?: boolean | null
          location?: string | null
          profile_picture_url?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      provider_registrations: {
        Row: {
          additional_documents_urls: string[] | null
          admin_notes: string | null
          business_address: string
          business_license_url: string | null
          business_name: string
          created_at: string
          description: string | null
          email: string
          experience: string
          full_name: string
          id: string
          id_proof_document_url: string | null
          id_proof_number: string
          id_proof_type: string
          phone: string
          service_categories: string[]
          status: string
          updated_at: string
          user_id: string
          verified: boolean
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          additional_documents_urls?: string[] | null
          admin_notes?: string | null
          business_address: string
          business_license_url?: string | null
          business_name: string
          created_at?: string
          description?: string | null
          email: string
          experience: string
          full_name: string
          id?: string
          id_proof_document_url?: string | null
          id_proof_number: string
          id_proof_type: string
          phone: string
          service_categories: string[]
          status?: string
          updated_at?: string
          user_id: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          additional_documents_urls?: string[] | null
          admin_notes?: string | null
          business_address?: string
          business_license_url?: string | null
          business_name?: string
          created_at?: string
          description?: string | null
          email?: string
          experience?: string
          full_name?: string
          id?: string
          id_proof_document_url?: string | null
          id_proof_number?: string
          id_proof_type?: string
          phone?: string
          service_categories?: string[]
          status?: string
          updated_at?: string
          user_id?: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      provider_services: {
        Row: {
          created_at: string
          custom_service_name: string | null
          description: string | null
          estimated_time: string
          id: string
          images: string[] | null
          is_available: boolean
          master_service_id: string | null
          price_range: string
          provider_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_service_name?: string | null
          description?: string | null
          estimated_time: string
          id?: string
          images?: string[] | null
          is_available?: boolean
          master_service_id?: string | null
          price_range: string
          provider_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_service_name?: string | null
          description?: string | null
          estimated_time?: string
          id?: string
          images?: string[] | null
          is_available?: boolean
          master_service_id?: string | null
          price_range?: string
          provider_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_services_master_service_id_fkey"
            columns: ["master_service_id"]
            isOneToOne: false
            referencedRelation: "master_services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_images: {
        Row: {
          alt_text: string | null
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          master_service_id: string | null
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          master_service_id?: string | null
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          master_service_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_images_master_service_id_fkey"
            columns: ["master_service_id"]
            isOneToOne: false
            referencedRelation: "master_services"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_provider_service: {
        Args: {
          p_custom_service_name?: string
          p_description?: string
          p_estimated_time?: string
          p_images?: string[]
          p_master_service_id?: string
          p_price_range?: string
        }
        Returns: string
      }
      create_booking: {
        Args: {
          p_address?: string
          p_notes?: string
          p_payment_method?: string
          p_provider_id: string
          p_provider_service_id: string
          p_scheduled_date?: string
          p_scheduled_time?: string
          p_total_amount?: number
        }
        Returns: string
      }
      delete_provider_service: {
        Args: { service_id: string }
        Returns: undefined
      }
      get_master_services: {
        Args: Record<PropertyKey, never>
        Returns: {
          base_price_range: string
          category: string
          description: string
          estimated_time: string
          id: string
          image_url: string
          is_active: boolean
          name: string
        }[]
      }
      get_my_provider_services: {
        Args: { provider_id: string }
        Returns: {
          custom_service_name: string
          description: string
          estimated_time: string
          id: string
          images: string[]
          is_available: boolean
          master_service: Json
          master_service_id: string
          price_range: string
        }[]
      }
      get_provider_services: {
        Args: { service_category?: string }
        Returns: {
          custom_service_name: string
          description: string
          estimated_time: string
          id: string
          images: string[]
          is_available: boolean
          master_service: Json
          master_service_id: string
          price_range: string
          provider_id: string
          provider_profile: Json
        }[]
      }
      get_service_categories: {
        Args: Record<PropertyKey, never>
        Returns: {
          description: string
          icon: string
          id: string
          is_active: boolean
          name: string
        }[]
      }
      get_service_images: {
        Args: { service_id: string }
        Returns: {
          alt_text: string
          display_order: number
          id: string
          image_url: string
        }[]
      }
      get_user_bookings: {
        Args: { user_id: string }
        Returns: {
          address: string
          created_at: string
          customer_id: string
          customer_profile: Json
          id: string
          notes: string
          payment_method: string
          payment_status: string
          provider_id: string
          provider_profile: Json
          provider_service: Json
          provider_service_id: string
          scheduled_date: string
          scheduled_time: string
          status: string
          total_amount: number
          updated_at: string
        }[]
      }
      update_booking_status: {
        Args: { booking_id: string; new_status: string }
        Returns: boolean
      }
      update_profile: {
        Args: { profile_data: Json; user_id: string }
        Returns: boolean
      }
      update_provider_service: {
        Args: {
          p_description?: string
          p_estimated_time?: string
          p_images?: string[]
          p_is_available?: boolean
          p_price_range?: string
          service_id: string
        }
        Returns: undefined
      }
      verify_provider: {
        Args:
          | {
              admin_user_id: string
              new_status: string
              notes?: string
              registration_id: string
            }
          | { registration_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
