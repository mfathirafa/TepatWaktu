import { supabase } from './supabase';
import type { Profile } from '../types';

export const profileService = {
  async get(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data as Profile;
  },

  async update(userId: string, payload: Partial<Pick<Profile, 'name' | 'whatsapp' | 'avatar_url'>>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data as Profile;
  },

  async uploadAvatar(userId: string, file: File): Promise<string> {
    const ext = file.name.split('.').pop();
    const path = `avatars/${userId}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from('public-assets')
      .upload(path, file, { upsert: true });
    if (uploadErr) throw uploadErr;
    const { data } = supabase.storage.from('public-assets').getPublicUrl(path);
    return data.publicUrl;
  },
};
