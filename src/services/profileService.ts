
import { supabase } from '@/integrations/supabase/client';

export interface ProfileData {
  full_name?: string;
  location?: string;
  profile_picture_url?: string;
  role?: 'customer' | 'provider' | 'admin';
  phone?: string;
  is_available?: boolean;
  bio?: string;
}

export const profileService = {
  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as any; // Type assertion since schema includes additional fields
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  async createProfile(userId: string, profileData: ProfileData) {
    try {
      const { data, error } = await (supabase as any)
        .rpc('create_profile', {
          user_id: userId,
          profile_data: profileData
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  async updateProfile(userId: string, profileData: ProfileData) {
    try {
      const { data, error } = await (supabase as any)
        .rpc('update_profile', {
          user_id: userId,
          profile_data: profileData
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async uploadProfilePicture(userId: string, file: File) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  },

  async deleteProfilePicture(userId: string) {
    try {
      const { error } = await supabase.storage
        .from('avatars')
        .remove([`${userId}/avatar`]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      throw error;
    }
  }
};
