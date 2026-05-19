import { useCallback, useEffect, useState } from 'react';
import { warrantyService } from '../services/warrantyService';
import { useAuth } from '../context/AuthContext';
import type { Asset, AssetInsert, WarrantyInsert } from '../types';

export function useWarranties() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await warrantyService.getAll(user.id);
      setAssets(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const addAsset = async (assetPayload: AssetInsert, warrantyPayload: Omit<WarrantyInsert, 'asset_id'>) => {
    if (!user) return;
    await warrantyService.createAsset(user.id, assetPayload, warrantyPayload);
    await fetch();
  };

  const deleteAsset = async (assetId: string) => {
    await warrantyService.deleteAsset(assetId);
    setAssets(prev => prev.filter(a => a.id !== assetId));
  };

  return { assets, loading, error, refetch: fetch, addAsset, deleteAsset };
}
