export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      consultations: {
        Row: {
          date_time: string | null
          followup_required: boolean | null
          id: string
          notes: string | null
          recommendations: string | null
          specialist_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          date_time?: string | null
          followup_required?: boolean | null
          id?: string
          notes?: string | null
          recommendations?: string | null
          specialist_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          date_time?: string | null
          followup_required?: boolean | null
          id?: string
          notes?: string | null
          recommendations?: string | null
          specialist_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultations_specialist_id_fkey"
            columns: ["specialist_id"]
            isOneToOne: false
            referencedRelation: "specialists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      educational_content: {
        Row: {
          author: string | null
          content_type: string | null
          content_url: string | null
          description: string | null
          id: string
          published_date: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          author?: string | null
          content_type?: string | null
          content_url?: string | null
          description?: string | null
          id?: string
          published_date?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          author?: string | null
          content_type?: string | null
          content_url?: string | null
          description?: string | null
          id?: string
          published_date?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          benefits: string[] | null
          description: string | null
          id: string
          name: string
          potential_irritants: boolean | null
          scientific_name: string | null
          suitable_for: string[] | null
        }
        Insert: {
          benefits?: string[] | null
          description?: string | null
          id?: string
          name: string
          potential_irritants?: boolean | null
          scientific_name?: string | null
          suitable_for?: string[] | null
        }
        Update: {
          benefits?: string[] | null
          description?: string | null
          id?: string
          name?: string
          potential_irritants?: boolean | null
          scientific_name?: string | null
          suitable_for?: string[] | null
        }
        Relationships: []
      }
      product_ingredients: {
        Row: {
          id: string
          ingredient_id: string | null
          product_id: string | null
        }
        Insert: {
          id?: string
          ingredient_id?: string | null
          product_id?: string | null
        }
        Update: {
          id?: string
          ingredient_id?: string | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_ingredients_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_safety_analyses: {
        Row: {
          analysis_date: string | null
          compatibility_score: number | null
          id: string
          potential_issues: string[] | null
          product_id: string | null
          recommendations: string | null
          safe_to_use: boolean | null
          user_id: string | null
        }
        Insert: {
          analysis_date?: string | null
          compatibility_score?: number | null
          id?: string
          potential_issues?: string[] | null
          product_id?: string | null
          recommendations?: string | null
          safe_to_use?: boolean | null
          user_id?: string | null
        }
        Update: {
          analysis_date?: string | null
          compatibility_score?: number | null
          id?: string
          potential_issues?: string[] | null
          product_id?: string | null
          recommendations?: string | null
          safe_to_use?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_safety_analyses_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_safety_analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          average_rating: number | null
          brand: string | null
          category: string | null
          concerns_addressed: string[] | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          name: string
          price_range: string | null
          suitable_for: string[] | null
        }
        Insert: {
          average_rating?: number | null
          brand?: string | null
          category?: string | null
          concerns_addressed?: string[] | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          name: string
          price_range?: string | null
          suitable_for?: string[] | null
        }
        Update: {
          average_rating?: number | null
          brand?: string | null
          category?: string | null
          concerns_addressed?: string[] | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          name?: string
          price_range?: string | null
          suitable_for?: string[] | null
        }
        Relationships: []
      }
      skin_analyses: {
        Row: {
          ai_analysis_results: Json | null
          created_at: string | null
          detected_issues: string[] | null
          id: string
          image_url: string | null
          recommendations: Json | null
          severity_scores: Json | null
          user_id: string | null
        }
        Insert: {
          ai_analysis_results?: Json | null
          created_at?: string | null
          detected_issues?: string[] | null
          id?: string
          image_url?: string | null
          recommendations?: Json | null
          severity_scores?: Json | null
          user_id?: string | null
        }
        Update: {
          ai_analysis_results?: Json | null
          created_at?: string | null
          detected_issues?: string[] | null
          id?: string
          image_url?: string | null
          recommendations?: Json | null
          severity_scores?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      skin_journal: {
        Row: {
          date: string | null
          diet_notes: string | null
          id: string
          image_url: string | null
          mood: string | null
          notes: string | null
          sleep_quality: number | null
          stress_level: number | null
          user_id: string | null
        }
        Insert: {
          date?: string | null
          diet_notes?: string | null
          id?: string
          image_url?: string | null
          mood?: string | null
          notes?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          user_id?: string | null
        }
        Update: {
          date?: string | null
          diet_notes?: string | null
          id?: string
          image_url?: string | null
          mood?: string | null
          notes?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skin_journal_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      skin_profiles: {
        Row: {
          allergies: string[] | null
          created_at: string | null
          environment_factors: Json | null
          id: string
          skin_concerns: string[] | null
          skin_type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string | null
          environment_factors?: Json | null
          id?: string
          skin_concerns?: string[] | null
          skin_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          allergies?: string[] | null
          created_at?: string | null
          environment_factors?: Json | null
          id?: string
          skin_concerns?: string[] | null
          skin_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skin_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      skincare_routines: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          products: string[] | null
          routine_type: string | null
          steps: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          products?: string[] | null
          routine_type?: string | null
          steps?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          products?: string[] | null
          routine_type?: string | null
          steps?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skincare_routines_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      specialists: {
        Row: {
          auth_id: string | null
          bio: string | null
          first_name: string | null
          id: string
          image_url: string | null
          last_name: string | null
          qualifications: string[] | null
          specialty: string | null
          verified: boolean | null
        }
        Insert: {
          auth_id?: string | null
          bio?: string | null
          first_name?: string | null
          id?: string
          image_url?: string | null
          last_name?: string | null
          qualifications?: string[] | null
          specialty?: string | null
          verified?: boolean | null
        }
        Update: {
          auth_id?: string | null
          bio?: string | null
          first_name?: string | null
          id?: string
          image_url?: string | null
          last_name?: string | null
          qualifications?: string[] | null
          specialty?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      treatment_tracking: {
        Row: {
          analysis_id: string | null
          created_at: string | null
          id: string
          progress: Json | null
          solution_index: number | null
          start_date: string | null
          status: string | null
        }
        Insert: {
          analysis_id?: string | null
          created_at?: string | null
          id?: string
          progress?: Json | null
          solution_index?: number | null
          start_date?: string | null
          status?: string | null
        }
        Update: {
          analysis_id?: string | null
          created_at?: string | null
          id?: string
          progress?: Json | null
          solution_index?: number | null
          start_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_tracking_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "skin_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_product_history: {
        Row: {
          effectiveness: number | null
          id: string
          notes: string | null
          product_id: string | null
          rating: number | null
          side_effects: string[] | null
          usage_end_date: string | null
          usage_start_date: string | null
          user_id: string | null
        }
        Insert: {
          effectiveness?: number | null
          id?: string
          notes?: string | null
          product_id?: string | null
          rating?: number | null
          side_effects?: string[] | null
          usage_end_date?: string | null
          usage_start_date?: string | null
          user_id?: string | null
        }
        Update: {
          effectiveness?: number | null
          id?: string
          notes?: string | null
          product_id?: string | null
          rating?: number | null
          side_effects?: string[] | null
          usage_end_date?: string | null
          usage_start_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_product_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_product_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          stripe_customer_id: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
