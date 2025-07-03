
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
      .rpc('get_master_services');

    if (error) {
      console.error('Error fetching master services:', error);
      return [];
    }
    return (data || []) as MasterService[];
  },

  // Get all service categories
  async getServiceCategories() {
    const { data, error } = await supabase
      .rpc('get_service_categories');

    if (error) {
      console.error('Error fetching service categories:', error);
      return [];
    }
    return (data || []) as ServiceCategory[];
  },

  // Get provider services with master service details
  async getProviderServices(category?: string) {
    const { data, error } = await supabase
      .rpc('get_provider_services', { service_category: category });

    if (error) {
      console.error('Error fetching provider services:', error);
      return [];
    }
    return (data || []) as ProviderService[];
  },

  // Get provider's own services
  async getMyProviderServices(providerId: string) {
    const { data, error } = await supabase
      .rpc('get_my_provider_services', { provider_id: providerId });

    if (error) {
      console.error('Error fetching my provider services:', error);
      return [];
    }
    return (data || []) as ProviderService[];
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
      .rpc('add_provider_service', {
        p_master_service_id: service.master_service_id,
        p_custom_service_name: service.custom_service_name,
        p_price_range: service.price_range,
        p_estimated_time: service.estimated_time,
        p_description: service.description,
        p_images: service.images
      });

    if (error) throw error;
    return data;
  },

  // Update provider service
  async updateProviderService(id: string, updates: Partial<ProviderService>) {
    const { data, error } = await supabase
      .rpc('update_provider_service', {
        service_id: id,
        updates: updates
      });

    if (error) throw error;
    return data;
  },

  // Delete provider service
  async deleteProviderService(id: string) {
    const { error } = await supabase
      .rpc('delete_provider_service', { service_id: id });

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
      .rpc('add_master_service', service);

    if (error) throw error;
    return data;
  }
};
