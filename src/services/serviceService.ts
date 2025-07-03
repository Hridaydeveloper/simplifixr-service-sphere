
import { supabase } from '@/integrations/supabase/client';

export interface MasterService {
  id: string;
  name: string;
  category: string;
  description: string | null;
  base_price_range: string | null;
  estimated_time: string | null;
  image_url: string | null;
  is_active: boolean;
}

export interface ProviderService {
  id: string;
  provider_id: string;
  master_service_id: string | null;
  custom_service_name: string | null;
  price_range: string;
  estimated_time: string;
  description: string | null;
  is_available: boolean;
  images: string[] | null;
  master_service?: MasterService;
  provider_profile?: {
    full_name: string;
    location: string;
  };
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  is_active: boolean;
}

export const serviceService = {
  // Get all active master services
  async getMasterServices() {
    const { data, error } = await supabase
      .from('master_services')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data as MasterService[];
  },

  // Get all service categories
  async getServiceCategories() {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data as ServiceCategory[];
  },

  // Get provider services with master service details
  async getProviderServices(category?: string) {
    let query = supabase
      .from('provider_services')
      .select(`
        *,
        master_service:master_services(*),
        provider_profile:profiles!provider_services_provider_id_fkey(full_name, location)
      `)
      .eq('is_available', true);

    if (category) {
      query = query.eq('master_services.category', category);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data as ProviderService[];
  },

  // Get provider's own services
  async getMyProviderServices(providerId: string) {
    const { data, error } = await supabase
      .from('provider_services')
      .select(`
        *,
        master_service:master_services(*)
      `)
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Add a new provider service
  async addProviderService(service: {
    master_service_id?: string;
    custom_service_name?: string;
    price_range: string;
    estimated_time: string;
    description?: string;
    images?: string[];
  }) {
    const { data, error } = await supabase
      .from('provider_services')
      .insert({
        provider_id: (await supabase.auth.getUser()).data.user?.id,
        ...service
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update provider service
  async updateProviderService(id: string, updates: Partial<ProviderService>) {
    const { data, error } = await supabase
      .from('provider_services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete provider service
  async deleteProviderService(id: string) {
    const { error } = await supabase
      .from('provider_services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Add custom service to master services (admin only)
  async addCustomMasterService(service: {
    name: string;
    category: string;
    description?: string;
    base_price_range?: string;
    estimated_time?: string;
    image_url?: string;
  }) {
    const { data, error } = await supabase
      .from('master_services')
      .insert(service)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
