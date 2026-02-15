export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          owner_id: string;
          full_name: string;
          email: string | null;
          phone: string | null;
          source: string;
          status: 'new' | 'contacted' | 'qualified' | 'won' | 'lost';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string;
          full_name: string;
          email?: string | null;
          phone?: string | null;
          source?: string;
          status?: 'new' | 'contacted' | 'qualified' | 'won' | 'lost';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['leads']['Insert']>;
      };
      user_settings: {
        Row: { owner_id: string; inbound_token: string; created_at: string; updated_at: string };
        Insert: { owner_id: string; inbound_token: string; created_at?: string; updated_at?: string };
        Update: { inbound_token?: string; updated_at?: string };
      };
      follow_up_queue: {
        Row: {
          id: string;
          owner_id: string;
          lead_id: string;
          channel: 'sms' | 'email';
          scheduled_for: string;
          status: 'pending' | 'sent' | 'failed' | 'skipped';
          message: string;
          error_message: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string;
          lead_id: string;
          channel: 'sms' | 'email';
          scheduled_for: string;
          status?: 'pending' | 'sent' | 'failed' | 'skipped';
          message: string;
          error_message?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['follow_up_queue']['Insert']>;
      };
      billing_customers: {
        Row: {
          owner_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          billing_status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          owner_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          billing_status?: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete';
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['billing_customers']['Insert']>;
      };
    };
  };
};
