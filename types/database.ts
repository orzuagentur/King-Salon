export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      ai_knowledge: {
        Row: {
          active: boolean;
          category: string;
          content: string;
          created_at: string;
          id: string;
          pinned: boolean;
          sort_order: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          category: string;
          content: string;
          created_at?: string;
          id?: string;
          pinned?: boolean;
          sort_order?: number;
          title: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          category?: string;
          content?: string;
          created_at?: string;
          id?: string;
          pinned?: boolean;
          sort_order?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_memory: {
        Row: {
          active: boolean;
          content: string;
          created_at: string;
          id: string;
          pinned: boolean;
          sort_order: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          content: string;
          created_at?: string;
          id?: string;
          pinned?: boolean;
          sort_order?: number;
          title: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          content?: string;
          created_at?: string;
          id?: string;
          pinned?: boolean;
          sort_order?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_site_content_cache: {
        Row: {
          fingerprint: string;
          id: string;
          page_count: number;
          payload: Json;
          synced_at: string;
        };
        Insert: {
          fingerprint: string;
          id?: string;
          page_count?: number;
          payload: Json;
          synced_at?: string;
        };
        Update: {
          fingerprint?: string;
          id?: string;
          page_count?: number;
          payload?: Json;
          synced_at?: string;
        };
        Relationships: [];
      };
      ai_settings: {
        Row: {
          agent_avatar: string | null;
          agent_name: string | null;
          behavior_notes: string | null;
          id: string;
          language: string;
          system_prompt: string | null;
          theme_color: string;
          tone: string | null;
          updated_at: string;
          welcome_message: string | null;
        };
        Insert: {
          agent_avatar?: string | null;
          agent_name?: string | null;
          behavior_notes?: string | null;
          id?: string;
          language?: string;
          system_prompt?: string | null;
          theme_color?: string;
          tone?: string | null;
          updated_at?: string;
          welcome_message?: string | null;
        };
        Update: {
          agent_avatar?: string | null;
          agent_name?: string | null;
          behavior_notes?: string | null;
          id?: string;
          language?: string;
          system_prompt?: string | null;
          theme_color?: string;
          tone?: string | null;
          updated_at?: string;
          welcome_message?: string | null;
        };
        Relationships: [];
      };
      admins: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          role: "admin" | "editor";
        };
        Insert: {
          created_at?: string;
          email: string;
          id: string;
          role?: "admin" | "editor";
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          role?: "admin" | "editor";
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          appointment_date: string;
          appointment_time: string;
          created_at: string;
          customer_email: string;
          customer_name: string;
          customer_phone: string;
          duration_minutes: number;
          id: string;
          master_id: string;
          message: string | null;
          status: Database["public"]["Enums"]["booking_status"];
          updated_at: string;
        };
        Insert: {
          appointment_date: string;
          appointment_time: string;
          created_at?: string;
          customer_email: string;
          customer_name: string;
          customer_phone: string;
          duration_minutes?: number;
          id?: string;
          master_id: string;
          message?: string | null;
          status?: Database["public"]["Enums"]["booking_status"];
          updated_at?: string;
        };
        Update: {
          appointment_date?: string;
          appointment_time?: string;
          created_at?: string;
          customer_email?: string;
          customer_name?: string;
          customer_phone?: string;
          duration_minutes?: number;
          id?: string;
          master_id?: string;
          message?: string | null;
          status?: Database["public"]["Enums"]["booking_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_master_id_fkey";
            columns: ["master_id"];
            isOneToOne: false;
            referencedRelation: "masters";
            referencedColumns: ["id"];
          },
        ];
      };
      gallery: {
        Row: {
          alt: string | null;
          category: string;
          created_at: string;
          id: string;
          image: string;
          sort_order: number;
          title: string | null;
        };
        Insert: {
          alt?: string | null;
          category: string;
          created_at?: string;
          id?: string;
          image: string;
          sort_order?: number;
          title?: string | null;
        };
        Update: {
          alt?: string | null;
          category?: string;
          created_at?: string;
          id?: string;
          image?: string;
          sort_order?: number;
          title?: string | null;
        };
        Relationships: [];
      };
      masters: {
        Row: {
          active: boolean;
          created_at: string;
          id: string;
          name: string;
          sort_order: number;
          title: string | null;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          id?: string;
          name: string;
          sort_order?: number;
          title?: string | null;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          id?: string;
          name?: string;
          sort_order?: number;
          title?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      homepage_content: {
        Row: {
          hero_background_image: string;
          hero_background_media_type: string;
          hero_card_city: string;
          hero_card_hours: string;
          hero_card_street: string;
          hero_eyebrow: string;
          hero_image: string;
          hero_image_alt: string;
          hero_stat_location: string;
          hero_stat_style: string;
          hero_subtitle: string;
          hero_title: string;
          id: string;
          site_name: string;
          updated_at: string;
        };
        Insert: {
          hero_background_image?: string;
          hero_background_media_type?: string;
          hero_card_city?: string;
          hero_card_hours?: string;
          hero_card_street?: string;
          hero_eyebrow: string;
          hero_image?: string;
          hero_image_alt?: string;
          hero_stat_location?: string;
          hero_stat_style?: string;
          hero_subtitle: string;
          hero_title: string;
          id?: string;
          site_name?: string;
          updated_at?: string;
        };
        Update: {
          hero_background_image?: string;
          hero_background_media_type?: string;
          hero_card_city?: string;
          hero_card_hours?: string;
          hero_card_street?: string;
          hero_eyebrow?: string;
          hero_image?: string;
          hero_image_alt?: string;
          hero_stat_location?: string;
          hero_stat_style?: string;
          hero_subtitle?: string;
          hero_title?: string;
          id?: string;
          site_name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          active: boolean;
          created_at: string;
          id: string;
          name: string;
          rating: number;
          sort_order: number;
          text: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          id?: string;
          name: string;
          rating: number;
          sort_order?: number;
          text: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          id?: string;
          name?: string;
          rating?: number;
          sort_order?: number;
          text?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          active: boolean;
          created_at: string;
          description: string;
          duration: string | null;
          id: string;
          image: string | null;
          price: number;
          sort_order: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          description: string;
          duration?: string | null;
          id?: string;
          image?: string | null;
          price: number;
          sort_order?: number;
          title: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          description?: string;
          duration?: string | null;
          id?: string;
          image?: string | null;
          price?: number;
          sort_order?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          address: string;
          email: string | null;
          facebook: string | null;
          google_maps_url: string | null;
          id: string;
          instagram: string | null;
          opening_hours: Json;
          phone: string;
          seo_description: string;
          seo_title: string;
          updated_at: string;
          whatsapp: string | null;
        };
        Insert: {
          address: string;
          email?: string | null;
          facebook?: string | null;
          google_maps_url?: string | null;
          id?: string;
          instagram?: string | null;
          opening_hours: Json;
          phone: string;
          seo_description: string;
          seo_title: string;
          updated_at?: string;
          whatsapp?: string | null;
        };
        Update: {
          address?: string;
          email?: string | null;
          facebook?: string | null;
          google_maps_url?: string | null;
          id?: string;
          instagram?: string | null;
          opening_hours?: Json;
          phone?: string;
          seo_description?: string;
          seo_title?: string;
          updated_at?: string;
          whatsapp?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_booking_slot_available: {
        Args: {
          p_date: string;
          p_master_id: string;
          p_time: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      admin_role: "admin" | "editor";
      booking_status: "pending" | "confirmed" | "cancelled" | "completed";
    };
    CompositeTypes: Record<string, never>;
  };
};
