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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          severity: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          severity?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          severity?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      authors: {
        Row: {
          article_count: number | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string
          email: string | null
          expertise_areas: string[] | null
          id: string
          is_active: boolean | null
          linkedin_url: string | null
          slug: string
          twitter_handle: string | null
          updated_at: string | null
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          article_count?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name: string
          email?: string | null
          expertise_areas?: string[] | null
          id?: string
          is_active?: boolean | null
          linkedin_url?: string | null
          slug: string
          twitter_handle?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          article_count?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string
          email?: string | null
          expertise_areas?: string[] | null
          id?: string
          is_active?: boolean | null
          linkedin_url?: string | null
          slug?: string
          twitter_handle?: string | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      blocked_ips: {
        Row: {
          blocked_at: string | null
          blocked_by: string | null
          expires_at: string | null
          id: string
          ip_address: unknown
          is_permanent: boolean | null
          notes: string | null
          reason: string
        }
        Insert: {
          blocked_at?: string | null
          blocked_by?: string | null
          expires_at?: string | null
          id?: string
          ip_address: unknown
          is_permanent?: boolean | null
          notes?: string | null
          reason: string
        }
        Update: {
          blocked_at?: string | null
          blocked_by?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          is_permanent?: boolean | null
          notes?: string | null
          reason?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          body: string
          content_id: string
          created_at: string | null
          id: string
          is_deleted: boolean | null
          is_edited: boolean | null
          is_pinned: boolean | null
          is_verified_author: boolean | null
          parent_comment_id: string | null
          updated_at: string | null
          upvote_count: number | null
          user_id: string
        }
        Insert: {
          body: string
          content_id: string
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          is_pinned?: boolean | null
          is_verified_author?: boolean | null
          parent_comment_id?: string | null
          updated_at?: string | null
          upvote_count?: number | null
          user_id: string
        }
        Update: {
          body?: string
          content_id?: string
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          is_pinned?: boolean | null
          is_verified_author?: boolean | null
          parent_comment_id?: string | null
          updated_at?: string | null
          upvote_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "featured_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "feed_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      content: {
        Row: {
          archived_at: string | null
          author_id: string | null
          body: string | null
          content_type: string | null
          created_at: string | null
          difficulty_level: string | null
          engagement_score: number | null
          excerpt: string | null
          featured_image_url: string | null
          featured_priority: number | null
          id: string
          is_breaking: boolean | null
          is_featured: boolean | null
          is_premium: boolean | null
          published_at: string | null
          read_time_minutes: number | null
          security_score: number | null
          seo_meta_description: string | null
          seo_meta_title: string | null
          slug: string
          status: string
          summary: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          archived_at?: string | null
          author_id?: string | null
          body?: string | null
          content_type?: string | null
          created_at?: string | null
          difficulty_level?: string | null
          engagement_score?: number | null
          excerpt?: string | null
          featured_image_url?: string | null
          featured_priority?: number | null
          id?: string
          is_breaking?: boolean | null
          is_featured?: boolean | null
          is_premium?: boolean | null
          published_at?: string | null
          read_time_minutes?: number | null
          security_score?: number | null
          seo_meta_description?: string | null
          seo_meta_title?: string | null
          slug: string
          status?: string
          summary?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          archived_at?: string | null
          author_id?: string | null
          body?: string | null
          content_type?: string | null
          created_at?: string | null
          difficulty_level?: string | null
          engagement_score?: number | null
          excerpt?: string | null
          featured_image_url?: string | null
          featured_priority?: number | null
          id?: string
          is_breaking?: boolean | null
          is_featured?: boolean | null
          is_premium?: boolean | null
          published_at?: string | null
          read_time_minutes?: number | null
          security_score?: number | null
          seo_meta_description?: string | null
          seo_meta_title?: string | null
          slug?: string
          status?: string
          summary?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
      content_analytics: {
        Row: {
          avg_time_on_page: number | null
          bookmark_count: number | null
          bounce_rate: number | null
          comment_count: number | null
          content_id: string
          created_at: string | null
          date: string
          id: string
          share_count: number | null
          unique_visitors: number | null
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          avg_time_on_page?: number | null
          bookmark_count?: number | null
          bounce_rate?: number | null
          comment_count?: number | null
          content_id: string
          created_at?: string | null
          date: string
          id?: string
          share_count?: number | null
          unique_visitors?: number | null
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          avg_time_on_page?: number | null
          bookmark_count?: number | null
          bounce_rate?: number | null
          comment_count?: number | null
          content_id?: string
          created_at?: string | null
          date?: string
          id?: string
          share_count?: number | null
          unique_visitors?: number | null
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_analytics_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_analytics_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "featured_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_analytics_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "feed_content_view"
            referencedColumns: ["id"]
          },
        ]
      }
      content_feeds: {
        Row: {
          added_at: string | null
          content_id: string
          display_order: number | null
          feed_id: number
          pinned: boolean | null
          pinned_until: string | null
        }
        Insert: {
          added_at?: string | null
          content_id: string
          display_order?: number | null
          feed_id: number
          pinned?: boolean | null
          pinned_until?: string | null
        }
        Update: {
          added_at?: string | null
          content_id?: string
          display_order?: number | null
          feed_id?: number
          pinned?: boolean | null
          pinned_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_feeds_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_feeds_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "featured_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_feeds_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "feed_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_feeds_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "feed_content_view"
            referencedColumns: ["feed_id"]
          },
          {
            foreignKeyName: "content_feeds_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "feeds"
            referencedColumns: ["id"]
          },
        ]
      }
      content_niches: {
        Row: {
          content_id: string
          niche_id: number
        }
        Insert: {
          content_id: string
          niche_id: number
        }
        Update: {
          content_id?: string
          niche_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_niches_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_niches_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "featured_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_niches_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "feed_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_niches_niche_id_fkey"
            columns: ["niche_id"]
            isOneToOne: false
            referencedRelation: "niches"
            referencedColumns: ["id"]
          },
        ]
      }
      content_series: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          thumbnail_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      content_tags: {
        Row: {
          content_id: string
          tag_id: string
        }
        Insert: {
          content_id: string
          tag_id: string
        }
        Update: {
          content_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_tags_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_tags_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "featured_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_tags_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "feed_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_slots: {
        Row: {
          active_from: string | null
          active_until: string | null
          content_id: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          slot_name: string
          slot_type: string
          updated_at: string | null
        }
        Insert: {
          active_from?: string | null
          active_until?: string | null
          content_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          slot_name: string
          slot_type: string
          updated_at?: string | null
        }
        Update: {
          active_from?: string | null
          active_until?: string | null
          content_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          slot_name?: string
          slot_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_slots_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_slots_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "featured_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_slots_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "feed_content_view"
            referencedColumns: ["id"]
          },
        ]
      }
      feeds: {
        Row: {
          color_code: string
          created_at: string | null
          description: string | null
          display_order: number
          icon: string | null
          id: number
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          color_code: string
          created_at?: string | null
          description?: string | null
          display_order?: number
          icon?: string | null
          id: number
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          color_code?: string
          created_at?: string | null
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      interstitial_banners: {
        Row: {
          active_from: string | null
          active_until: string | null
          background_color: string | null
          banner_type: string
          click_count: number | null
          content_id: string | null
          created_at: string | null
          cta_text: string | null
          display_frequency: string | null
          external_url: string | null
          id: string
          image_url: string | null
          impression_count: number | null
          is_active: boolean | null
          priority: number | null
          subtitle: string | null
          target_audience: string | null
          text_color: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          active_from?: string | null
          active_until?: string | null
          background_color?: string | null
          banner_type: string
          click_count?: number | null
          content_id?: string | null
          created_at?: string | null
          cta_text?: string | null
          display_frequency?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          impression_count?: number | null
          is_active?: boolean | null
          priority?: number | null
          subtitle?: string | null
          target_audience?: string | null
          text_color?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          active_from?: string | null
          active_until?: string | null
          background_color?: string | null
          banner_type?: string
          click_count?: number | null
          content_id?: string | null
          created_at?: string | null
          cta_text?: string | null
          display_frequency?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          impression_count?: number | null
          is_active?: boolean | null
          priority?: number | null
          subtitle?: string | null
          target_audience?: string | null
          text_color?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interstitial_banners_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interstitial_banners_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "featured_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interstitial_banners_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "feed_content_view"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_queue: {
        Row: {
          action_taken: string | null
          content_id: string
          content_type: string
          created_at: string | null
          description: string | null
          id: string
          moderator_notes: string | null
          reason: string
          reported_by: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
        }
        Insert: {
          action_taken?: string | null
          content_id: string
          content_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          moderator_notes?: string | null
          reason: string
          reported_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Update: {
          action_taken?: string | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          moderator_notes?: string | null
          reason?: string
          reported_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Relationships: []
      }
      niches: {
        Row: {
          color_code: string
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          color_code: string
          created_at?: string | null
          id: number
          name: string
        }
        Update: {
          color_code?: string
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action: string
          attempt_count: number | null
          blocked_until: string | null
          id: string
          ip_address: unknown
          is_blocked: boolean | null
          last_attempt: string | null
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          action: string
          attempt_count?: number | null
          blocked_until?: string | null
          id?: string
          ip_address?: unknown
          is_blocked?: boolean | null
          last_attempt?: string | null
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          action?: string
          attempt_count?: number | null
          blocked_until?: string | null
          id?: string
          ip_address?: unknown
          is_blocked?: boolean | null
          last_attempt?: string | null
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      reading_history: {
        Row: {
          completed: boolean | null
          content_id: string
          first_viewed_at: string | null
          id: string
          last_position: string | null
          last_viewed_at: string | null
          progress_percentage: number | null
          time_spent_seconds: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          content_id: string
          first_viewed_at?: string | null
          id?: string
          last_position?: string | null
          last_viewed_at?: string | null
          progress_percentage?: number | null
          time_spent_seconds?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          content_id?: string
          first_viewed_at?: string | null
          id?: string
          last_position?: string | null
          last_viewed_at?: string | null
          progress_percentage?: number | null
          time_spent_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_history_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_history_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "featured_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_history_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "feed_content_view"
            referencedColumns: ["id"]
          },
        ]
      }
      redirects: {
        Row: {
          created_at: string | null
          hit_count: number | null
          id: string
          is_active: boolean | null
          new_path: string
          old_path: string
          redirect_type: number | null
        }
        Insert: {
          created_at?: string | null
          hit_count?: number | null
          id?: string
          is_active?: boolean | null
          new_path: string
          old_path: string
          redirect_type?: number | null
        }
        Update: {
          created_at?: string | null
          hit_count?: number | null
          id?: string
          is_active?: boolean | null
          new_path?: string
          old_path?: string
          redirect_type?: number | null
        }
        Relationships: []
      }
      related_content: {
        Row: {
          content_id: string
          created_at: string | null
          related_content_id: string
          relation_type: string | null
          relevance_score: number | null
        }
        Insert: {
          content_id: string
          created_at?: string | null
          related_content_id: string
          relation_type?: string | null
          relevance_score?: number | null
        }
        Update: {
          content_id?: string
          created_at?: string | null
          related_content_id?: string
          relation_type?: string | null
          relevance_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "related_content_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_content_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "featured_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_content_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "feed_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_content_related_id_fkey"
            columns: ["related_content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_content_related_id_fkey"
            columns: ["related_content_id"]
            isOneToOne: false
            referencedRelation: "featured_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_content_related_id_fkey"
            columns: ["related_content_id"]
            isOneToOne: false
            referencedRelation: "feed_content_view"
            referencedColumns: ["id"]
          },
        ]
      }
      security_alerts: {
        Row: {
          affected_systems: string[] | null
          alert_type: string
          content_id: string | null
          created_at: string | null
          description: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          published_at: string | null
          severity: string
          source_url: string | null
          title: string
        }
        Insert: {
          affected_systems?: string[] | null
          alert_type: string
          content_id?: string | null
          created_at?: string | null
          description: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          published_at?: string | null
          severity: string
          source_url?: string | null
          title: string
        }
        Update: {
          affected_systems?: string[] | null
          alert_type?: string
          content_id?: string | null
          created_at?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          published_at?: string | null
          severity?: string
          source_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_alerts_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_alerts_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "featured_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_alerts_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "feed_content_view"
            referencedColumns: ["id"]
          },
        ]
      }
      series_content: {
        Row: {
          added_at: string | null
          content_id: string
          display_order: number | null
          episode_number: number | null
          series_id: string
        }
        Insert: {
          added_at?: string | null
          content_id: string
          display_order?: number | null
          episode_number?: number | null
          series_id: string
        }
        Update: {
          added_at?: string | null
          content_id?: string
          display_order?: number | null
          episode_number?: number | null
          series_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "series_content_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "series_content_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "featured_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "series_content_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "feed_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "series_content_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "content_series"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_bookmarks: {
        Row: {
          content_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          content_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          content_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bookmarks_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bookmarks_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "featured_content_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bookmarks_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "feed_content_view"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          is_active: boolean | null
          role: string
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          role: string
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      featured_content_view: {
        Row: {
          archived_at: string | null
          author_avatar: string | null
          author_id: string | null
          author_name: string | null
          body: string | null
          content_type: string | null
          created_at: string | null
          difficulty_level: string | null
          display_order: number | null
          engagement_score: number | null
          excerpt: string | null
          featured_image_url: string | null
          featured_priority: number | null
          id: string | null
          is_breaking: boolean | null
          is_featured: boolean | null
          is_premium: boolean | null
          niches: string[] | null
          published_at: string | null
          read_time_minutes: number | null
          security_score: number | null
          seo_meta_description: string | null
          seo_meta_title: string | null
          slot_name: string | null
          slot_type: string | null
          slug: string | null
          status: string | null
          summary: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          view_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_content_view: {
        Row: {
          archived_at: string | null
          author_id: string | null
          author_name: string | null
          body: string | null
          content_type: string | null
          created_at: string | null
          difficulty_level: string | null
          engagement_score: number | null
          excerpt: string | null
          featured_image_url: string | null
          featured_priority: number | null
          feed_id: number | null
          feed_name: string | null
          feed_position: number | null
          feed_slug: string | null
          id: string | null
          is_breaking: boolean | null
          is_featured: boolean | null
          is_premium: boolean | null
          niches: string[] | null
          pinned: boolean | null
          published_at: string | null
          read_time_minutes: number | null
          security_score: number | null
          seo_meta_description: string | null
          seo_meta_title: string | null
          slug: string | null
          status: string | null
          summary: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          view_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      auto_archive_old_content: { Args: never; Returns: undefined }
      check_rate_limit: {
        Args: {
          p_action: string
          p_ip_address: unknown
          p_max_attempts?: number
          p_user_id: string
          p_window_minutes?: number
        }
        Returns: boolean
      }
      clean_expired_rate_limits: { Args: never; Returns: undefined }
      clean_old_audit_logs: { Args: never; Returns: undefined }
      is_ip_blocked: { Args: { p_ip_address: unknown }; Returns: boolean }
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
