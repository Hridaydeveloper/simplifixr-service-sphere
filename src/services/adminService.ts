import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  full_name: string | null;
  location: string | null;
  role: string;
  profile_picture_url: string | null;
}

export interface ProviderRegistration {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone: string;
  business_name: string;
  business_address: string;
  service_categories: string[];
  experience: string;
  description: string | null;
  id_proof_type: string;
  id_proof_number: string;
  id_proof_document_url: string | null;
  business_license_url: string | null;
  additional_documents_urls: string[] | null;
  status: string;
  verified: boolean;
  verified_at: string | null;
  verified_by: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceWithProvider {
  service_id: string;
  provider_id: string;
  provider_name: string | null;
  provider_email: string | null;
  provider_location: string | null;
  master_service_id: string | null;
  master_service_name: string | null;
  service_category: string | null;
  custom_service_name: string | null;
  price_range: string;
  estimated_time: string;
  description: string | null;
  images: string[] | null;
  is_available: boolean;
  created_at: string;
}

export interface AdminBooking {
  id: string;
  customer_id: string;
  customer_name: string | null;
  customer_email: string | null;
  provider_id: string;
  provider_name: string | null;
  provider_email: string | null;
  service_name: string | null;
  status: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  address: string;
  total_amount: number | null;
  payment_method: string | null;
  payment_status: string | null;
  created_at: string;
}

export const adminService = {
  // Get all users
  async getAllUsers(): Promise<AdminUser[]> {
    const { data, error } = await supabase.rpc('get_all_users');
    if (error) throw error;
    return data || [];
  },

  // Get provider statistics
  async getProviderStats() {
    const { data, error } = await supabase.rpc('get_provider_stats');
    if (error) throw error;
    return data?.[0] || { total_providers: 0, pending_providers: 0, approved_providers: 0, rejected_providers: 0 };
  },

  // Get all provider registrations
  async getAllProviderRegistrations(): Promise<ProviderRegistration[]> {
    const { data, error } = await supabase.rpc('get_all_provider_registrations');
    if (error) throw error;
    return data || [];
  },

  // Verify or reject provider
  async verifyProvider(registrationId: string, status: 'approved' | 'rejected', notes?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase.rpc('verify_provider', {
      registration_id: registrationId,
      admin_user_id: user.id,
      new_status: status,
      notes: notes || null
    });

    if (error) throw error;
    return data;
  },

  // Get all services with provider details
  async getAllServicesWithProviders(): Promise<ServiceWithProvider[]> {
    const { data, error } = await supabase.rpc('get_all_services_with_providers');
    if (error) throw error;
    return data || [];
  },

  // Get booking statistics
  async getBookingStats() {
    const { data, error } = await supabase.rpc('get_booking_stats');
    if (error) throw error;
    return data?.[0] || { 
      total_bookings: 0, 
      pending_bookings: 0, 
      confirmed_bookings: 0, 
      completed_bookings: 0, 
      cancelled_bookings: 0,
      total_revenue: 0 
    };
  },

  // Get all bookings
  async getAllBookings(): Promise<AdminBooking[]> {
    const { data, error } = await supabase.rpc('get_all_bookings_admin');
    if (error) throw error;
    return data || [];
  }
};
