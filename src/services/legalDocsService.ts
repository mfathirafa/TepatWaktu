import { supabase } from './supabase';
import type { LegalDoc, LegalDocInsert, LegalDocUpdate } from '../types';

export const legalDocsService = {
  async getAll(userId: string): Promise<LegalDoc[]> {
    const { data, error } = await supabase
      .from('legal_docs')
      .select('*')
      .eq('user_id', userId)
      .order('expiry_date', { ascending: true });
    if (error) throw error;
    return data as LegalDoc[];
  },

  async create(userId: string, payload: LegalDocInsert): Promise<LegalDoc> {
    const { data, error } = await supabase
      .from('legal_docs')
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data as LegalDoc;
  },

  async update(id: string, payload: LegalDocUpdate): Promise<LegalDoc> {
    const { data, error } = await supabase
      .from('legal_docs')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as LegalDoc;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('legal_docs').delete().eq('id', id);
    if (error) throw error;
  },
};
