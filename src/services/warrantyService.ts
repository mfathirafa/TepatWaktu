import { supabase } from './supabase';
import type { Asset, AssetInsert, Warranty, WarrantyInsert } from '../types';

export const warrantyService = {
  async getAll(userId: string): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('assets')
      .select('*, warranties(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Asset[];
  },

  async createAsset(userId: string, assetPayload: AssetInsert, warrantyPayload: Omit<WarrantyInsert, 'asset_id'>): Promise<Asset> {
    // 1. Insert asset
    const { data: asset, error: assetErr } = await supabase
      .from('assets')
      .insert({ ...assetPayload, user_id: userId })
      .select()
      .single();
    if (assetErr) throw assetErr;

    // 2. Insert warranty linked to asset
    const { error: wErr } = await supabase
      .from('warranties')
      .insert({ ...warrantyPayload, asset_id: asset.id });
    if (wErr) throw wErr;

    return asset as Asset;
  },

  async updateAsset(assetId: string, payload: Partial<AssetInsert>): Promise<Asset> {
    const { data, error } = await supabase
      .from('assets')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', assetId)
      .select()
      .single();
    if (error) throw error;
    return data as Asset;
  },

  async updateWarranty(warrantyId: string, payload: Partial<Omit<WarrantyInsert, 'asset_id'>>): Promise<Warranty> {
    const { data, error } = await supabase
      .from('warranties')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', warrantyId)
      .select()
      .single();
    if (error) throw error;
    return data as Warranty;
  },

  async deleteAsset(assetId: string): Promise<void> {
    // warranties cascade delete via FK
    const { error } = await supabase.from('assets').delete().eq('id', assetId);
    if (error) throw error;
  },
};
