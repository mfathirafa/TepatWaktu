import { useCallback, useEffect, useState } from 'react';
import { legalDocsService } from '../services/legalDocsService';
import { useAuth } from '../context/AuthContext';
import type { LegalDoc, LegalDocInsert, LegalDocUpdate } from '../types';

export function useLegalDocs() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<LegalDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await legalDocsService.getAll(user.id);
      setDocs(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const addDoc = async (payload: LegalDocInsert) => {
    if (!user) return;
    const newDoc = await legalDocsService.create(user.id, payload);
    setDocs(prev => [newDoc, ...prev]);
  };

  const updateDoc = async (id: string, payload: LegalDocUpdate) => {
    const updated = await legalDocsService.update(id, payload);
    setDocs(prev => prev.map(d => d.id === id ? updated : d));
  };

  const deleteDoc = async (id: string) => {
    await legalDocsService.delete(id);
    setDocs(prev => prev.filter(d => d.id !== id));
  };

  return { docs, loading, error, refetch: fetch, addDoc, updateDoc, deleteDoc };
}
