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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          organization_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audits: {
        Row: {
          actual_end_date: string | null
          actual_start_date: string | null
          audit_type: string | null
          created_at: string
          created_by: string | null
          description: string | null
          findings_summary: string | null
          framework_id: string | null
          id: string
          lead_auditor_id: string | null
          objectives: string[] | null
          organization_id: string | null
          planned_end_date: string | null
          planned_start_date: string | null
          scope: string | null
          status: Database["public"]["Enums"]["audit_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          audit_type?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          findings_summary?: string | null
          framework_id?: string | null
          id?: string
          lead_auditor_id?: string | null
          objectives?: string[] | null
          organization_id?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          scope?: string | null
          status?: Database["public"]["Enums"]["audit_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          audit_type?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          findings_summary?: string | null
          framework_id?: string | null
          id?: string
          lead_auditor_id?: string | null
          objectives?: string[] | null
          organization_id?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          scope?: string | null
          status?: Database["public"]["Enums"]["audit_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audits_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audits_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "compliance_frameworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audits_lead_auditor_id_fkey"
            columns: ["lead_auditor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audits_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_audit_logs: {
        Row: {
          additional_context: Json | null
          created_at: string
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          organization_id: string | null
          risk_score: number | null
          session_id: string | null
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          additional_context?: Json | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          organization_id?: string | null
          risk_score?: number | null
          session_id?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          additional_context?: Json | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          organization_id?: string | null
          risk_score?: number | null
          session_id?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      auth_settings: {
        Row: {
          created_at: string
          enable_captcha_after_attempts: number
          enable_leaked_password_check: boolean
          id: string
          lockout_duration_minutes: number
          max_login_attempts: number
          organization_id: string
          otp_expiry_seconds: number
          password_min_length: number
          require_lowercase: boolean
          require_numbers: boolean
          require_symbols: boolean
          require_uppercase: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          enable_captcha_after_attempts?: number
          enable_leaked_password_check?: boolean
          id?: string
          lockout_duration_minutes?: number
          max_login_attempts?: number
          organization_id: string
          otp_expiry_seconds?: number
          password_min_length?: number
          require_lowercase?: boolean
          require_numbers?: boolean
          require_symbols?: boolean
          require_uppercase?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          enable_captcha_after_attempts?: number
          enable_leaked_password_check?: boolean
          id?: string
          lockout_duration_minutes?: number
          max_login_attempts?: number
          organization_id?: string
          otp_expiry_seconds?: number
          password_min_length?: number
          require_lowercase?: boolean
          require_numbers?: boolean
          require_symbols?: boolean
          require_uppercase?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      calendar_integrations: {
        Row: {
          access_token: string | null
          auto_create_reminders: boolean | null
          created_at: string
          external_calendar_id: string | null
          id: string
          last_sync_at: string | null
          organization_id: string
          provider: string
          refresh_token: string | null
          sync_categories: Database["public"]["Enums"]["task_category"][] | null
          sync_direction: string | null
          sync_enabled: boolean | null
          sync_error_message: string | null
          sync_status: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          auto_create_reminders?: boolean | null
          created_at?: string
          external_calendar_id?: string | null
          id?: string
          last_sync_at?: string | null
          organization_id: string
          provider: string
          refresh_token?: string | null
          sync_categories?:
            | Database["public"]["Enums"]["task_category"][]
            | null
          sync_direction?: string | null
          sync_enabled?: boolean | null
          sync_error_message?: string | null
          sync_status?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          auto_create_reminders?: boolean | null
          created_at?: string
          external_calendar_id?: string | null
          id?: string
          last_sync_at?: string | null
          organization_id?: string
          provider?: string
          refresh_token?: string | null
          sync_categories?:
            | Database["public"]["Enums"]["task_category"][]
            | null
          sync_direction?: string | null
          sync_enabled?: boolean | null
          sync_error_message?: string | null
          sync_status?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      compliance_assessments: {
        Row: {
          actual_end_date: string | null
          actual_start_date: string | null
          assessment_type: string | null
          budget_range: string | null
          completion_percentage: number | null
          created_at: string
          created_by: string | null
          deliverables: string[] | null
          description: string | null
          findings: string | null
          framework_id: string
          framework_name: string | null
          id: string
          lead_assessor_email: string | null
          objectives: string[] | null
          organization_id: string | null
          planned_end_date: string | null
          planned_start_date: string | null
          priority_level: string | null
          recommendations: string[] | null
          scope: string | null
          selected_controls: string[] | null
          stakeholders: string[] | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          assessment_type?: string | null
          budget_range?: string | null
          completion_percentage?: number | null
          created_at?: string
          created_by?: string | null
          deliverables?: string[] | null
          description?: string | null
          findings?: string | null
          framework_id: string
          framework_name?: string | null
          id?: string
          lead_assessor_email?: string | null
          objectives?: string[] | null
          organization_id?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          priority_level?: string | null
          recommendations?: string[] | null
          scope?: string | null
          selected_controls?: string[] | null
          stakeholders?: string[] | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          assessment_type?: string | null
          budget_range?: string | null
          completion_percentage?: number | null
          created_at?: string
          created_by?: string | null
          deliverables?: string[] | null
          description?: string | null
          findings?: string | null
          framework_id?: string
          framework_name?: string | null
          id?: string
          lead_assessor_email?: string | null
          objectives?: string[] | null
          organization_id?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          priority_level?: string | null
          recommendations?: string[] | null
          scope?: string | null
          selected_controls?: string[] | null
          stakeholders?: string[] | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      compliance_frameworks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          jurisdiction: string | null
          name: string
          organization_id: string | null
          updated_at: string
          version: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          jurisdiction?: string | null
          name: string
          organization_id?: string | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          jurisdiction?: string | null
          name?: string
          organization_id?: string | null
          updated_at?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_frameworks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_requirements: {
        Row: {
          control_objective: string | null
          created_at: string
          description: string | null
          evidence_required: string[] | null
          framework_id: string | null
          id: string
          next_review_date: string | null
          owner_id: string | null
          reference_id: string
          status: Database["public"]["Enums"]["compliance_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          control_objective?: string | null
          created_at?: string
          description?: string | null
          evidence_required?: string[] | null
          framework_id?: string | null
          id?: string
          next_review_date?: string | null
          owner_id?: string | null
          reference_id: string
          status?: Database["public"]["Enums"]["compliance_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          control_objective?: string | null
          created_at?: string
          description?: string | null
          evidence_required?: string[] | null
          framework_id?: string | null
          id?: string
          next_review_date?: string | null
          owner_id?: string | null
          reference_id?: string
          status?: Database["public"]["Enums"]["compliance_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_requirements_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "compliance_frameworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_requirements_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_tasks: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          attachments: Json | null
          category: Database["public"]["Enums"]["task_category"]
          completed_at: string | null
          completion_percentage: number | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          linked_entity_id: string | null
          linked_entity_type: string | null
          metadata: Json | null
          organization_id: string
          parent_task_id: string | null
          priority: Database["public"]["Enums"]["task_priority"]
          recurrence_end_date: string | null
          recurrence_interval: number | null
          recurrence_pattern: Database["public"]["Enums"]["recurrence_pattern"]
          start_date: string | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          attachments?: Json | null
          category?: Database["public"]["Enums"]["task_category"]
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          linked_entity_id?: string | null
          linked_entity_type?: string | null
          metadata?: Json | null
          organization_id: string
          parent_task_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          recurrence_end_date?: string | null
          recurrence_interval?: number | null
          recurrence_pattern?: Database["public"]["Enums"]["recurrence_pattern"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          attachments?: Json | null
          category?: Database["public"]["Enums"]["task_category"]
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          linked_entity_id?: string | null
          linked_entity_type?: string | null
          metadata?: Json | null
          organization_id?: string
          parent_task_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          recurrence_end_date?: string | null
          recurrence_interval?: number | null
          recurrence_pattern?: Database["public"]["Enums"]["recurrence_pattern"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          description: string | null
          document_type: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          id: string
          is_confidential: boolean | null
          mime_type: string | null
          organization_id: string | null
          owner_id: string | null
          retention_date: string | null
          status: Database["public"]["Enums"]["document_status"] | null
          tags: string[] | null
          title: string
          updated_at: string
          uploaded_by: string | null
          version: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_type?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_confidential?: boolean | null
          mime_type?: string | null
          organization_id?: string | null
          owner_id?: string | null
          retention_date?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
          version?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          document_type?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_confidential?: boolean | null
          mime_type?: string | null
          organization_id?: string | null
          owner_id?: string | null
          retention_date?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enhanced_auth_attempts: {
        Row: {
          additional_data: Json | null
          attempt_type: string
          created_at: string
          email: string
          failure_reason: string | null
          id: string
          ip_address: unknown
          organization_id: string | null
          risk_score: number | null
          success: boolean
          user_agent: string | null
        }
        Insert: {
          additional_data?: Json | null
          attempt_type: string
          created_at?: string
          email: string
          failure_reason?: string | null
          id?: string
          ip_address: unknown
          organization_id?: string | null
          risk_score?: number | null
          success?: boolean
          user_agent?: string | null
        }
        Update: {
          additional_data?: Json | null
          attempt_type?: string
          created_at?: string
          email?: string
          failure_reason?: string | null
          id?: string
          ip_address?: unknown
          organization_id?: string | null
          risk_score?: number | null
          success?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      failed_login_attempts: {
        Row: {
          attempted_at: string
          email: string
          id: string
          ip_address: unknown
          organization_id: string | null
          user_agent: string | null
        }
        Insert: {
          attempted_at?: string
          email: string
          id?: string
          ip_address: unknown
          organization_id?: string | null
          user_agent?: string | null
        }
        Update: {
          attempted_at?: string
          email?: string
          id?: string
          ip_address?: unknown
          organization_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      incidents: {
        Row: {
          affected_systems: string[] | null
          assignee_id: string | null
          corrective_actions: string | null
          created_at: string
          description: string | null
          detected_at: string | null
          due_date: string | null
          id: string
          impact_description: string | null
          incident_type: string | null
          lessons_learned: string | null
          occurred_at: string | null
          organization_id: string | null
          reporter_id: string | null
          resolved_at: string | null
          root_cause: string | null
          severity: Database["public"]["Enums"]["incident_severity"] | null
          status: Database["public"]["Enums"]["incident_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          affected_systems?: string[] | null
          assignee_id?: string | null
          corrective_actions?: string | null
          created_at?: string
          description?: string | null
          detected_at?: string | null
          due_date?: string | null
          id?: string
          impact_description?: string | null
          incident_type?: string | null
          lessons_learned?: string | null
          occurred_at?: string | null
          organization_id?: string | null
          reporter_id?: string | null
          resolved_at?: string | null
          root_cause?: string | null
          severity?: Database["public"]["Enums"]["incident_severity"] | null
          status?: Database["public"]["Enums"]["incident_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          affected_systems?: string[] | null
          assignee_id?: string | null
          corrective_actions?: string | null
          created_at?: string
          description?: string | null
          detected_at?: string | null
          due_date?: string | null
          id?: string
          impact_description?: string | null
          incident_type?: string | null
          lessons_learned?: string | null
          occurred_at?: string | null
          organization_id?: string | null
          reporter_id?: string | null
          resolved_at?: string | null
          root_cause?: string | null
          severity?: Database["public"]["Enums"]["incident_severity"] | null
          status?: Database["public"]["Enums"]["incident_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incidents_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base_articles: {
        Row: {
          author_id: string | null
          category: string
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_featured: boolean | null
          organization_id: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          organization_id?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          organization_id?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string | null
          organization_id: string | null
          priority: string | null
          read_at: string | null
          read_status: boolean | null
          title: string
          type: string
          user_id: string | null
          wizard_session_id: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string | null
          organization_id?: string | null
          priority?: string | null
          read_at?: string | null
          read_status?: boolean | null
          title: string
          type: string
          user_id?: string | null
          wizard_session_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string | null
          organization_id?: string | null
          priority?: string | null
          read_at?: string | null
          read_status?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
          wizard_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_wizard_session_id_fkey"
            columns: ["wizard_session_id"]
            isOneToOne: false
            referencedRelation: "wizard_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          data_residency: string | null
          domain: string | null
          id: string
          logo_url: string | null
          name: string
          settings: Json | null
          slug: string
          subscription_plan: string | null
          subscription_status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_residency?: string | null
          domain?: string | null
          id?: string
          logo_url?: string | null
          name: string
          settings?: Json | null
          slug: string
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_residency?: string | null
          domain?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          settings?: Json | null
          slug?: string
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      otp_tokens: {
        Row: {
          code_hash: string
          created_at: string
          email: string
          expires_at: string
          id: string
          ip_address: unknown | null
          purpose: string
          used_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          code_hash: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          ip_address?: unknown | null
          purpose: string
          used_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          code_hash?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          purpose?: string
          used_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          ip_address: unknown | null
          token_hash: string
          used_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          ip_address?: unknown | null
          token_hash: string
          used_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          token_hash?: string
          used_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      policies: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          content: string | null
          created_at: string
          created_by: string | null
          description: string | null
          effective_date: string | null
          id: string
          next_review_date: string | null
          organization_id: string | null
          owner_id: string | null
          policy_type: string | null
          review_date: string | null
          status: Database["public"]["Enums"]["policy_status"] | null
          tags: string[] | null
          title: string
          updated_at: string
          version: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          effective_date?: string | null
          id?: string
          next_review_date?: string | null
          organization_id?: string | null
          owner_id?: string | null
          policy_type?: string | null
          review_date?: string | null
          status?: Database["public"]["Enums"]["policy_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          effective_date?: string | null
          id?: string
          next_review_date?: string | null
          organization_id?: string | null
          owner_id?: string | null
          policy_type?: string | null
          review_date?: string | null
          status?: Database["public"]["Enums"]["policy_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "policies_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          last_name: string | null
          organization_id: string | null
          phone: string | null
          preferences: Json | null
          role: Database["public"]["Enums"]["user_role"]
          title: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email: string
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          organization_id?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          title?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          organization_id?: string | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limit_attempts: {
        Row: {
          attempt_count: number
          blocked_until: string | null
          created_at: string
          id: string
          identifier: string
          identifier_type: string
          updated_at: string
          window_start: string
        }
        Insert: {
          attempt_count?: number
          blocked_until?: string | null
          created_at?: string
          id?: string
          identifier: string
          identifier_type: string
          updated_at?: string
          window_start?: string
        }
        Update: {
          attempt_count?: number
          blocked_until?: string | null
          created_at?: string
          id?: string
          identifier?: string
          identifier_type?: string
          updated_at?: string
          window_start?: string
        }
        Relationships: []
      }
      risk_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      risks: {
        Row: {
          category_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          impact: number | null
          likelihood: number | null
          mitigation_plan: string | null
          next_review_date: string | null
          organization_id: string | null
          owner_id: string | null
          residual_impact: number | null
          residual_likelihood: number | null
          residual_score: number | null
          risk_level: Database["public"]["Enums"]["risk_level"] | null
          risk_score: number | null
          status: Database["public"]["Enums"]["risk_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          impact?: number | null
          likelihood?: number | null
          mitigation_plan?: string | null
          next_review_date?: string | null
          organization_id?: string | null
          owner_id?: string | null
          residual_impact?: number | null
          residual_likelihood?: number | null
          residual_score?: number | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          risk_score?: number | null
          status?: Database["public"]["Enums"]["risk_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          impact?: number | null
          likelihood?: number | null
          mitigation_plan?: string | null
          next_review_date?: string | null
          organization_id?: string | null
          owner_id?: string | null
          residual_impact?: number | null
          residual_likelihood?: number | null
          residual_score?: number | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          risk_score?: number | null
          status?: Database["public"]["Enums"]["risk_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "risks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "risk_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risks_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_tiers: {
        Row: {
          created_at: string
          description: string | null
          features: Json
          id: string
          is_active: boolean | null
          limits: Json
          name: string
          price_monthly: number
          price_yearly: number | null
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          limits?: Json
          name: string
          price_monthly: number
          price_yearly?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          limits?: Json
          name?: string
          price_monthly?: number
          price_yearly?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      surge_alert_configs: {
        Row: {
          alert_name: string
          alert_type: string
          created_at: string
          id: string
          is_active: boolean | null
          last_triggered: string | null
          notification_types:
            | Database["public"]["Enums"]["reminder_type"][]
            | null
          organization_id: string
          recipient_roles: string[] | null
          recipient_users: string[] | null
          threshold_period_hours: number
          threshold_value: number
          trigger_count: number | null
          updated_at: string
        }
        Insert: {
          alert_name: string
          alert_type: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_triggered?: string | null
          notification_types?:
            | Database["public"]["Enums"]["reminder_type"][]
            | null
          organization_id: string
          recipient_roles?: string[] | null
          recipient_users?: string[] | null
          threshold_period_hours?: number
          threshold_value: number
          trigger_count?: number | null
          updated_at?: string
        }
        Update: {
          alert_name?: string
          alert_type?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_triggered?: string | null
          notification_types?:
            | Database["public"]["Enums"]["reminder_type"][]
            | null
          organization_id?: string
          recipient_roles?: string[] | null
          recipient_users?: string[] | null
          threshold_period_hours?: number
          threshold_value?: number
          trigger_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      task_reminders: {
        Row: {
          created_at: string
          delivery_status: string | null
          error_message: string | null
          id: string
          is_delivered: boolean | null
          is_sent: boolean | null
          message: string | null
          recipient_email: string | null
          recipient_id: string | null
          recipient_phone: string | null
          remind_before_minutes: number
          reminder_type: Database["public"]["Enums"]["reminder_type"]
          sent_at: string | null
          subject: string | null
          task_id: string
        }
        Insert: {
          created_at?: string
          delivery_status?: string | null
          error_message?: string | null
          id?: string
          is_delivered?: boolean | null
          is_sent?: boolean | null
          message?: string | null
          recipient_email?: string | null
          recipient_id?: string | null
          recipient_phone?: string | null
          remind_before_minutes: number
          reminder_type: Database["public"]["Enums"]["reminder_type"]
          sent_at?: string | null
          subject?: string | null
          task_id: string
        }
        Update: {
          created_at?: string
          delivery_status?: string | null
          error_message?: string | null
          id?: string
          is_delivered?: boolean | null
          is_sent?: boolean | null
          message?: string | null
          recipient_email?: string | null
          recipient_id?: string | null
          recipient_phone?: string | null
          remind_before_minutes?: number
          reminder_type?: Database["public"]["Enums"]["reminder_type"]
          sent_at?: string | null
          subject?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_reminders_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "compliance_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          organization_id: string
          role: Database["public"]["Enums"]["user_role"]
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          organization_id: string
          role?: Database["public"]["Enums"]["user_role"]
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          organization_id?: string
          role?: Database["public"]["Enums"]["user_role"]
          token?: string
        }
        Relationships: []
      }
      tutorial_progress: {
        Row: {
          completed_at: string | null
          completed_steps: string[] | null
          created_at: string
          current_step: string | null
          id: string
          tutorial_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_steps?: string[] | null
          created_at?: string
          current_step?: string | null
          id?: string
          tutorial_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_steps?: string[] | null
          created_at?: string
          current_step?: string | null
          id?: string
          tutorial_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          notification_preferences: Json | null
          theme_preferences: Json | null
          tutorial_preferences: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notification_preferences?: Json | null
          theme_preferences?: Json | null
          tutorial_preferences?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notification_preferences?: Json | null
          theme_preferences?: Json | null
          tutorial_preferences?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          invalidated_at: string | null
          ip_address: unknown | null
          last_activity: string
          role_at_login: Database["public"]["Enums"]["user_role"]
          session_token: string
          user_agent: string | null
          user_id: string
          user_role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          invalidated_at?: string | null
          ip_address?: unknown | null
          last_activity?: string
          role_at_login: Database["public"]["Enums"]["user_role"]
          session_token: string
          user_agent?: string | null
          user_id: string
          user_role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          invalidated_at?: string | null
          ip_address?: unknown | null
          last_activity?: string
          role_at_login?: Database["public"]["Enums"]["user_role"]
          session_token?: string
          user_agent?: string | null
          user_id?: string
          user_role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          organization_id: string
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier_id: string
          trial_end: string | null
          updated_at: string
          usage_stats: Json | null
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          organization_id: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier_id: string
          trial_end?: string | null
          updated_at?: string
          usage_stats?: Json | null
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          organization_id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier_id?: string
          trial_end?: string | null
          updated_at?: string
          usage_stats?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string
          created_by: string | null
          data_access_level: string | null
          description: string | null
          id: string
          last_assessment_date: string | null
          name: string
          next_assessment_date: string | null
          organization_id: string | null
          risk_level: Database["public"]["Enums"]["risk_level"] | null
          risk_score: number | null
          services_provided: string[] | null
          status: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string
          created_by?: string | null
          data_access_level?: string | null
          description?: string | null
          id?: string
          last_assessment_date?: string | null
          name: string
          next_assessment_date?: string | null
          organization_id?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          risk_score?: number | null
          services_provided?: string[] | null
          status?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string
          created_by?: string | null
          data_access_level?: string | null
          description?: string | null
          id?: string
          last_assessment_date?: string | null
          name?: string
          next_assessment_date?: string | null
          organization_id?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          risk_score?: number | null
          services_provided?: string[] | null
          status?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      wizard_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          organization_id: string
          result_data: Json | null
          session_data: Json | null
          started_at: string
          status: string
          summary: string | null
          updated_at: string
          user_id: string
          wizard_type: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          organization_id: string
          result_data?: Json | null
          session_data?: Json | null
          started_at?: string
          status?: string
          summary?: string | null
          updated_at?: string
          user_id: string
          wizard_type: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          organization_id?: string
          result_data?: Json | null
          session_data?: Json | null
          started_at?: string
          status?: string
          summary?: string | null
          updated_at?: string
          user_id?: string
          wizard_type?: string
        }
        Relationships: []
      }
      zoho_leads: {
        Row: {
          billing_interval: string
          company: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          lead_source: string | null
          lead_status: string | null
          metadata: Json | null
          phone: string | null
          selected_tier: string
          synced_to_zoho: boolean | null
          updated_at: string
          zoho_lead_id: string | null
        }
        Insert: {
          billing_interval: string
          company?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          lead_source?: string | null
          lead_status?: string | null
          metadata?: Json | null
          phone?: string | null
          selected_tier: string
          synced_to_zoho?: boolean | null
          updated_at?: string
          zoho_lead_id?: string | null
        }
        Update: {
          billing_interval?: string
          company?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          lead_source?: string | null
          lead_status?: string | null
          metadata?: Json | null
          phone?: string | null
          selected_tier?: string
          synced_to_zoho?: boolean | null
          updated_at?: string
          zoho_lead_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_auth_security_settings: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      check_organization_access: {
        Args: { target_org_id: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          p_identifier: string
          p_identifier_type: string
          p_max_attempts?: number
          p_window_minutes?: number
        }
        Returns: Json
      }
      check_rbac_permission: {
        Args: {
          p_user_id: string
          p_organization_id: string
          p_required_role: Database["public"]["Enums"]["user_role"]
          p_resource_type?: string
          p_action?: string
        }
        Returns: Json
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      enhanced_password_validation: {
        Args: { p_password: string; p_email?: string }
        Returns: Json
      }
      get_current_user_organization: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      record_rate_limit_attempt: {
        Args: {
          p_identifier: string
          p_identifier_type: string
          p_success?: boolean
        }
        Returns: undefined
      }
      user_has_admin_role: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      validate_password_strength: {
        Args: {
          p_password: string
          p_min_length?: number
          p_require_uppercase?: boolean
          p_require_lowercase?: boolean
          p_require_numbers?: boolean
          p_require_symbols?: boolean
        }
        Returns: Json
      }
    }
    Enums: {
      audit_status: "planned" | "in_progress" | "completed" | "cancelled"
      compliance_status:
        | "compliant"
        | "non_compliant"
        | "partially_compliant"
        | "pending_review"
      document_status:
        | "draft"
        | "under_review"
        | "approved"
        | "published"
        | "archived"
      incident_severity: "low" | "medium" | "high" | "critical"
      incident_status: "open" | "investigating" | "resolved" | "closed"
      policy_status:
        | "draft"
        | "under_review"
        | "approved"
        | "published"
        | "archived"
      recurrence_pattern:
        | "none"
        | "daily"
        | "weekly"
        | "monthly"
        | "quarterly"
        | "annually"
      reminder_type: "email" | "sms" | "in_app" | "slack" | "teams"
      risk_level: "low" | "medium" | "high" | "critical"
      risk_status: "open" | "in_progress" | "mitigated" | "accepted" | "closed"
      task_category:
        | "audit_due"
        | "policy_review"
        | "incident_followup"
        | "training_deadline"
        | "compliance_deadline"
        | "vendor_assessment"
        | "risk_review"
        | "regulatory_filing"
        | "credentialing"
        | "general"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status:
        | "pending"
        | "in_progress"
        | "completed"
        | "overdue"
        | "cancelled"
      user_role:
        | "super_admin"
        | "admin"
        | "compliance_officer"
        | "risk_manager"
        | "auditor"
        | "user"
        | "viewer"
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
      audit_status: ["planned", "in_progress", "completed", "cancelled"],
      compliance_status: [
        "compliant",
        "non_compliant",
        "partially_compliant",
        "pending_review",
      ],
      document_status: [
        "draft",
        "under_review",
        "approved",
        "published",
        "archived",
      ],
      incident_severity: ["low", "medium", "high", "critical"],
      incident_status: ["open", "investigating", "resolved", "closed"],
      policy_status: [
        "draft",
        "under_review",
        "approved",
        "published",
        "archived",
      ],
      recurrence_pattern: [
        "none",
        "daily",
        "weekly",
        "monthly",
        "quarterly",
        "annually",
      ],
      reminder_type: ["email", "sms", "in_app", "slack", "teams"],
      risk_level: ["low", "medium", "high", "critical"],
      risk_status: ["open", "in_progress", "mitigated", "accepted", "closed"],
      task_category: [
        "audit_due",
        "policy_review",
        "incident_followup",
        "training_deadline",
        "compliance_deadline",
        "vendor_assessment",
        "risk_review",
        "regulatory_filing",
        "credentialing",
        "general",
      ],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: [
        "pending",
        "in_progress",
        "completed",
        "overdue",
        "cancelled",
      ],
      user_role: [
        "super_admin",
        "admin",
        "compliance_officer",
        "risk_manager",
        "auditor",
        "user",
        "viewer",
      ],
    },
  },
} as const
