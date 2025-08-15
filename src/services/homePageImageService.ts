import { supabase } from "@/integrations/supabase/client";

export interface HomePageImage {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const homePageImageService = {
  // Get all active home page images ordered by display_order
  async getActiveImages(): Promise<HomePageImage[]> {
    const { data, error } = await supabase
      .from('home_page_images')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching home page images:', error);
      throw error;
    }

    return data || [];
  },

  // Get all home page images (admin only)
  async getAllImages(): Promise<HomePageImage[]> {
    const { data, error } = await supabase
      .from('home_page_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching all home page images:', error);
      throw error;
    }

    return data || [];
  },

  // Add a new home page image (admin only)
  async addImage(image: Omit<HomePageImage, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Promise<HomePageImage> {
    const { data, error } = await supabase
      .from('home_page_images')
      .insert([image])
      .select()
      .single();

    if (error) {
      console.error('Error adding home page image:', error);
      throw error;
    }

    return data;
  },

  // Update a home page image (admin only)
  async updateImage(id: string, updates: Partial<Omit<HomePageImage, 'id' | 'created_at' | 'updated_at' | 'created_by'>>): Promise<HomePageImage> {
    const { data, error } = await supabase
      .from('home_page_images')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating home page image:', error);
      throw error;
    }

    return data;
  },

  // Delete a home page image (admin only)
  async deleteImage(id: string): Promise<void> {
    const { error } = await supabase
      .from('home_page_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting home page image:', error);
      throw error;
    }
  },

  // Toggle image active status (admin only)
  async toggleImageStatus(id: string, is_active: boolean): Promise<HomePageImage> {
    const { data, error } = await supabase
      .from('home_page_images')
      .update({ is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling image status:', error);
      throw error;
    }

    return data;
  }
};