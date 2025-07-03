
import { supabase } from '@/integrations/supabase/client';

export interface Booking {
  id: string;
  customer_id: string;
  provider_id: string;
  provider_service_id: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_date: string | null;
  notes: string | null;
  total_amount: number | null;
  created_at: string;
  updated_at: string;
  provider_service?: {
    master_service?: { name: string };
    custom_service_name?: string;
    price_range: string;
  };
  customer_profile?: { full_name: string };
  provider_profile?: { full_name: string };
}

export const bookingService = {
  // Create a new booking
  async createBooking(booking: {
    provider_id: string;
    provider_service_id: string;
    scheduled_date?: string;
    notes?: string;
    total_amount?: number;
  }) {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        customer_id: (await supabase.auth.getUser()).data.user?.id,
        ...booking
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's bookings (as customer or provider)
  async getMyBookings() {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        provider_service:provider_services(
          master_service:master_services(name),
          custom_service_name,
          price_range
        ),
        customer_profile:profiles!bookings_customer_id_fkey(full_name),
        provider_profile:profiles!bookings_provider_id_fkey(full_name)
      `)
      .or(`customer_id.eq.${userId},provider_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Booking[];
  },

  // Update booking status
  async updateBookingStatus(id: string, status: Booking['status']) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
