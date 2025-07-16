export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
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
          location: string | null
          profile_picture_url: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          location?: string | null
          profile_picture_url?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_provider_service: {
        Args: {
          p_master_service_id?: string
          p_custom_service_name?: string
          p_price_range?: string
          p_estimated_time?: string
          p_description?: string
          p_images?: string[]
        }
        Returns: string
      }
      get_master_services: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          category: string
          description: string
          base_price_range: string
          estimated_time: string
          image_url: string
          is_active: boolean
        }[]
      }
      get_my_provider_services: {
        Args: { provider_id: string }
        Returns: {
          id: string
          master_service_id: string
          custom_service_name: string
          price_range: string
          estimated_time: string
          description: string
          images: string[]
          is_available: boolean
          master_service: Json
        }[]
      }
      get_provider_services: {
        Args: { service_category?: string }
        Returns: {
          id: string
          provider_id: string
          master_service_id: string
          custom_service_name: string
          price_range: string
          estimated_time: string
          description: string
          images: string[]
          is_available: boolean
          master_service: Json
          provider_profile: Json
        }[]
      }
      get_service_categories: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          icon: string
          description: string
          is_active: boolean
        }[]
      }
      verify_provider: {
        Args:
          | { registration_id: string }
          | {
              registration_id: string
              admin_user_id: string
              new_status: string
              notes?: string
            }
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
