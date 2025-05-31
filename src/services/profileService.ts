
import { supabase } from '@/integrations/supabase/client';

export interface ProfileData {
  full_name?: string;
  location?: string;
  profile_picture_url?: string;
}

export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateProfile(userId: string, profileData: ProfileData) {
    const { data, error } = await (supabase as any)
      .from('profiles')
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async uploadProfilePicture(userId: string, file: File) {
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
  },

  async deleteProfilePicture(userId: string) {
    const { error } = await supabase.storage
      .from('avatars')
      .remove([`${userId}/avatar`]);

    if (error) throw error;
  }
};
