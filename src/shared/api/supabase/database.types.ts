export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      entry_passes: {
        Row: {
          expires_at: string;
          game_session_id: string;
          id: string;
          issued_at: string;
          participation_id: string;
          qr_secret_version: string;
          qr_token_hash: string;
          scanned_by: string | null;
          status: Database['public']['Enums']['entry_pass_status'];
          used_at: string | null;
          user_id: string;
        };
        Insert: {
          expires_at: string;
          game_session_id: string;
          id?: string;
          issued_at?: string;
          participation_id: string;
          qr_secret_version?: string;
          qr_token_hash: string;
          scanned_by?: string | null;
          status?: Database['public']['Enums']['entry_pass_status'];
          used_at?: string | null;
          user_id: string;
        };
        Update: {
          expires_at?: string;
          game_session_id?: string;
          id?: string;
          issued_at?: string;
          participation_id?: string;
          qr_secret_version?: string;
          qr_token_hash?: string;
          scanned_by?: string | null;
          status?: Database['public']['Enums']['entry_pass_status'];
          used_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'entry_passes_game_session_id_fkey';
            columns: ['game_session_id'];
            isOneToOne: false;
            referencedRelation: 'game_sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'entry_passes_participation_id_fkey';
            columns: ['participation_id'];
            isOneToOne: false;
            referencedRelation: 'participations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'entry_passes_scanned_by_fkey';
            columns: ['scanned_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'entry_passes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      fcm_tokens: {
        Row: {
          created_at: string;
          installation_id: string;
          last_seen_at: string;
          platform: Database['public']['Enums']['fcm_platform'];
          token: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          installation_id: string;
          last_seen_at?: string;
          platform?: Database['public']['Enums']['fcm_platform'];
          token: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          installation_id?: string;
          last_seen_at?: string;
          platform?: Database['public']['Enums']['fcm_platform'];
          token?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fcm_tokens_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      fields: {
        Row: {
          address: string | null;
          created_at: string;
          id: string;
          lat: number | null;
          lng: number | null;
          name: string;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          id?: string;
          lat?: number | null;
          lng?: number | null;
          name: string;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          id?: string;
          lat?: number | null;
          lng?: number | null;
          name?: string;
        };
        Relationships: [];
      };
      game_rule_presets: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_public: boolean;
          name: string;
          owner_id: string | null;
          rules: Json;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_public?: boolean;
          name: string;
          owner_id?: string | null;
          rules?: Json;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_public?: boolean;
          name?: string;
          owner_id?: string | null;
          rules?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'game_rule_presets_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      game_sessions: {
        Row: {
          bank_account_holder: string;
          bank_account_number: string;
          bank_name: string;
          cancel_deadline: string;
          capacity: number;
          confirmed_count: number;
          created_at: string;
          created_by_user_id: string;
          custom_rules: Json | null;
          ends_at: string | null;
          field_id: string | null;
          field_name: string | null;
          game_fee: number;
          host_team_id: string | null;
          id: string;
          payment_method: Database['public']['Enums']['payment_method'];
          preset_id: string | null;
          reminder_sent: boolean;
          starts_at: string;
          status: Database['public']['Enums']['game_session_status'];
          title: string;
          updated_at: string;
        };
        Insert: {
          bank_account_holder: string;
          bank_account_number: string;
          bank_name: string;
          cancel_deadline: string;
          capacity: number;
          confirmed_count?: number;
          created_at?: string;
          created_by_user_id: string;
          custom_rules?: Json | null;
          ends_at?: string | null;
          field_id?: string | null;
          field_name?: string | null;
          game_fee: number;
          host_team_id?: string | null;
          id?: string;
          payment_method?: Database['public']['Enums']['payment_method'];
          preset_id?: string | null;
          reminder_sent?: boolean;
          starts_at: string;
          status?: Database['public']['Enums']['game_session_status'];
          title: string;
          updated_at?: string;
        };
        Update: {
          bank_account_holder?: string;
          bank_account_number?: string;
          bank_name?: string;
          cancel_deadline?: string;
          capacity?: number;
          confirmed_count?: number;
          created_at?: string;
          created_by_user_id?: string;
          custom_rules?: Json | null;
          ends_at?: string | null;
          field_id?: string | null;
          field_name?: string | null;
          game_fee?: number;
          host_team_id?: string | null;
          id?: string;
          payment_method?: Database['public']['Enums']['payment_method'];
          preset_id?: string | null;
          reminder_sent?: boolean;
          starts_at?: string;
          status?: Database['public']['Enums']['game_session_status'];
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'game_sessions_created_by_user_id_fkey';
            columns: ['created_by_user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'game_sessions_field_id_fkey';
            columns: ['field_id'];
            isOneToOne: false;
            referencedRelation: 'fields';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'game_sessions_host_team_id_fkey';
            columns: ['host_team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'game_sessions_preset_id_fkey';
            columns: ['preset_id'];
            isOneToOne: false;
            referencedRelation: 'game_rule_presets';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          action_url: string;
          body: string;
          created_at: string;
          data: Json | null;
          game_session_id: string | null;
          id: string;
          is_read: boolean;
          participation_id: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: {
          action_url: string;
          body: string;
          created_at?: string;
          data?: Json | null;
          game_session_id?: string | null;
          id?: string;
          is_read?: boolean;
          participation_id?: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Update: {
          action_url?: string;
          body?: string;
          created_at?: string;
          data?: Json | null;
          game_session_id?: string | null;
          id?: string;
          is_read?: boolean;
          participation_id?: string | null;
          title?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_game_session_id_fkey';
            columns: ['game_session_id'];
            isOneToOne: false;
            referencedRelation: 'game_sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_participation_id_fkey';
            columns: ['participation_id'];
            isOneToOne: false;
            referencedRelation: 'participations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      participations: {
        Row: {
          created_at: string;
          game_session_id: string;
          id: string;
          status: Database['public']['Enums']['participation_status'];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          game_session_id: string;
          id?: string;
          status?: Database['public']['Enums']['participation_status'];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          game_session_id?: string;
          id?: string;
          status?: Database['public']['Enums']['participation_status'];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'participations_game_session_id_fkey';
            columns: ['game_session_id'];
            isOneToOne: false;
            referencedRelation: 'game_sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'participations_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      payment_submissions: {
        Row: {
          amount: number;
          game_session_id: string;
          id: string;
          participation_id: string;
          receipt_path: string;
          rejection_reason: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          sender_name: string;
          status: Database['public']['Enums']['payment_submission_status'];
          submitted_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          game_session_id: string;
          id?: string;
          participation_id: string;
          receipt_path: string;
          rejection_reason?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          sender_name: string;
          status?: Database['public']['Enums']['payment_submission_status'];
          submitted_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          game_session_id?: string;
          id?: string;
          participation_id?: string;
          receipt_path?: string;
          rejection_reason?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          sender_name?: string;
          status?: Database['public']['Enums']['payment_submission_status'];
          submitted_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'payment_submissions_game_session_id_fkey';
            columns: ['game_session_id'];
            isOneToOne: false;
            referencedRelation: 'game_sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payment_submissions_participation_id_fkey';
            columns: ['participation_id'];
            isOneToOne: false;
            referencedRelation: 'participations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payment_submissions_reviewed_by_fkey';
            columns: ['reviewed_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payment_submissions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      refund_requests: {
        Row: {
          account_holder: string;
          account_number_encrypted: string;
          bank_name: string;
          game_session_id: string;
          id: string;
          note: string | null;
          participation_id: string;
          processed_at: string | null;
          processed_by: string | null;
          reason: string | null;
          requested_at: string;
          status: Database['public']['Enums']['refund_request_status'];
          user_id: string;
        };
        Insert: {
          account_holder: string;
          account_number_encrypted: string;
          bank_name: string;
          game_session_id: string;
          id?: string;
          note?: string | null;
          participation_id: string;
          processed_at?: string | null;
          processed_by?: string | null;
          reason?: string | null;
          requested_at?: string;
          status?: Database['public']['Enums']['refund_request_status'];
          user_id: string;
        };
        Update: {
          account_holder?: string;
          account_number_encrypted?: string;
          bank_name?: string;
          game_session_id?: string;
          id?: string;
          note?: string | null;
          participation_id?: string;
          processed_at?: string | null;
          processed_by?: string | null;
          reason?: string | null;
          requested_at?: string;
          status?: Database['public']['Enums']['refund_request_status'];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'refund_requests_game_session_id_fkey';
            columns: ['game_session_id'];
            isOneToOne: false;
            referencedRelation: 'game_sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'refund_requests_participation_id_fkey';
            columns: ['participation_id'];
            isOneToOne: true;
            referencedRelation: 'participations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'refund_requests_processed_by_fkey';
            columns: ['processed_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'refund_requests_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      teams: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string;
          display_name: string;
          email: string | null;
          id: string;
          last_active_at: string;
          phone_number: string | null;
          team_id: string | null;
        };
        Insert: {
          created_at?: string;
          display_name?: string;
          email?: string | null;
          id: string;
          last_active_at?: string;
          phone_number?: string | null;
          team_id?: string | null;
        };
        Update: {
          created_at?: string;
          display_name?: string;
          email?: string | null;
          id?: string;
          last_active_at?: string;
          phone_number?: string | null;
          team_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'users_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      app_error: {
        Args: { p_code: string; p_detail?: string; p_message: string };
        Returns: undefined;
      };
      approve_participation: {
        Args: { p_participation_id: string };
        Returns: Json;
      };
      assert_profile_complete: { Args: { p_uid: string }; Returns: undefined };
      assert_session_owner: {
        Args: {
          p_session: Database['public']['Tables']['game_sessions']['Row'];
          p_uid: string;
        };
        Returns: undefined;
      };
      assert_session_status: {
        Args: {
          p_operation: string;
          p_status: Database['public']['Enums']['game_session_status'];
        };
        Returns: undefined;
      };
      build_entry_pass_token: {
        Args: {
          p_entry_pass_id: string;
          p_game_session_id: string;
          p_issued_at: string;
          p_user_id: string;
          p_version: string;
        };
        Returns: string;
      };
      cancel_game_session: {
        Args: { p_reason?: string; p_session_id: string };
        Returns: Json;
      };
      cancel_participation: {
        Args: { p_participation_id: string; p_reason?: string };
        Returns: Json;
      };
      create_game_session: { Args: { p_input: Json }; Returns: Json };
      current_uid: { Args: never; Returns: string };
      fn_send_reminders: { Args: never; Returns: undefined };
      fn_status_transition: { Args: never; Returns: undefined };
      get_entry_pass_token: { Args: { p_session_id: string }; Returns: Json };
      hash_entry_pass_token: { Args: { p_token: string }; Returns: string };
      is_session_owner: { Args: { sid: string }; Returns: boolean };
      issue_entry_pass: {
        Args: {
          p_participation: Database['public']['Tables']['participations']['Row'];
          p_session: Database['public']['Tables']['game_sessions']['Row'];
        };
        Returns: string;
      };
      join_as_operator: { Args: { p_session_id: string }; Returns: Json };
      mark_attendance: { Args: { p_participation_id: string }; Returns: Json };
      mark_payment_reviewed: {
        Args: { p_submission_id: string };
        Returns: Json;
      };
      notify: {
        Args: {
          p_action_url: string;
          p_body: string;
          p_data?: Json;
          p_participation_id?: string;
          p_session_id?: string;
          p_title: string;
          p_type: string;
          p_user_id: string;
        };
        Returns: string;
      };
      reject_participation: {
        Args: { p_participation_id: string; p_reason?: string };
        Returns: Json;
      };
      reject_payment: {
        Args: { p_reason: string; p_submission_id: string };
        Returns: Json;
      };
      request_participation: { Args: { p_session_id: string }; Returns: Json };
      request_refund: {
        Args: {
          p_account_holder: string;
          p_account_number: string;
          p_bank_name: string;
          p_participation_id: string;
          p_reason?: string;
        };
        Returns: Json;
      };
      scan_entry_pass: {
        Args: { p_entry_pass_id: string; p_token: string };
        Returns: Json;
      };
      submit_payment: {
        Args: {
          p_amount: number;
          p_participation_id: string;
          p_receipt_path: string;
          p_sender_name: string;
        };
        Returns: Json;
      };
      try_timestamptz: { Args: { p: string }; Returns: string };
      try_uuid: { Args: { p: string }; Returns: string };
      update_game_session: {
        Args: { p_session_id: string; p_updates: Json };
        Returns: Json;
      };
      vault_secret: { Args: { p_name: string }; Returns: string };
    };
    Enums: {
      entry_pass_status: 'active' | 'used' | 'revoked' | 'expired';
      fcm_platform: 'web' | 'ios' | 'android';
      game_session_status: 'recruiting' | 'closed' | 'inProgress' | 'completed' | 'cancelled';
      participation_status:
        | 'pendingApproval'
        | 'rejected'
        | 'awaitingPayment'
        | 'paymentReview'
        | 'confirmed'
        | 'cancelled'
        | 'refundRequested'
        | 'attended';
      payment_method: 'pre_transfer';
      payment_submission_status: 'pending' | 'approved' | 'rejected';
      refund_request_status: 'requested' | 'approved' | 'completed' | 'rejected';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      entry_pass_status: ['active', 'used', 'revoked', 'expired'],
      fcm_platform: ['web', 'ios', 'android'],
      game_session_status: ['recruiting', 'closed', 'inProgress', 'completed', 'cancelled'],
      participation_status: [
        'pendingApproval',
        'rejected',
        'awaitingPayment',
        'paymentReview',
        'confirmed',
        'cancelled',
        'refundRequested',
        'attended',
      ],
      payment_method: ['pre_transfer'],
      payment_submission_status: ['pending', 'approved', 'rejected'],
      refund_request_status: ['requested', 'approved', 'completed', 'rejected'],
    },
  },
} as const;
