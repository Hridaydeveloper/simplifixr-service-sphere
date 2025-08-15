
import { supabase } from '@/integrations/supabase/client';

export interface Booking {
  id: string;
  customer_id: string;
  provider_id: string;
  provider_service_id: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_date: string | null;
  scheduled_time?: string | null;
  address?: string | null;
  notes: string | null;
  total_amount: number | null;
  payment_method?: string | null;
  payment_status?: string | null;
  created_at: string;
  updated_at: string;
  provider_service?: {
    master_service?: { name: string };
    custom_service_name?: string;
    price_range: string;
  };
  customer_profile?: { full_name: string };
  provider_profile?: { full_name: string; location?: string };
}

export const bookingService = {
  // Create a new booking
  async createBooking(booking: {
    provider_id: string;
    provider_service_id: string;
    scheduled_date?: string;
    scheduled_time?: string;
    address: string;
    notes?: string;
    total_amount?: number;
    payment_method?: string;
  }) {
    const { data, error } = await (supabase as any)
      .rpc('create_booking', {
        p_provider_id: booking.provider_id,
        p_provider_service_id: booking.provider_service_id,
        p_scheduled_date: booking.scheduled_date,
        p_scheduled_time: booking.scheduled_time,
        p_address: booking.address,
        p_notes: booking.notes,
        p_total_amount: booking.total_amount,
        p_payment_method: booking.payment_method
      });

    if (error) throw error;
    return data;
  },

  // Get user's bookings (as customer or provider)
  async getMyBookings() {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Using RPC function to handle complex queries
    const { data, error } = await (supabase as any)
      .rpc('get_user_bookings', { user_id: userId });

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
    
    return (data || []) as Booking[];
  },

  // Update booking status
  async updateBookingStatus(id: string, status: Booking['status']) {
    const { data, error } = await (supabase as any)
      .rpc('update_booking_status', {
        booking_id: id,
        new_status: status
      });

    if (error) throw error;
    return data;
  }
};
