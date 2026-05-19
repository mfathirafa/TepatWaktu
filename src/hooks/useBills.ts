import { useCallback, useEffect, useState } from 'react';
import { billsService } from '../services/billsService';
import { useAuth } from '../context/AuthContext';
import type { Bill, BillInsert, BillUpdate } from '../types';

export function useBills() {
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await billsService.getAll(user.id);
      setBills(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const addBill = async (payload: BillInsert) => {
    if (!user) return;
    const newBill = await billsService.create(user.id, payload);
    setBills(prev => [newBill, ...prev]);
  };

  const updateBill = async (id: string, payload: BillUpdate) => {
    const updated = await billsService.update(id, payload);
    setBills(prev => prev.map(b => b.id === id ? updated : b));
  };

  const markPaid = async (bill: Bill) => {
    const updated = await billsService.markPaid(bill);
    setBills(prev => prev.map(b => b.id === bill.id ? updated : b));
  };

  const deleteBill = async (id: string) => {
    await billsService.delete(id);
    setBills(prev => prev.filter(b => b.id !== id));
  };

  return { bills, loading, error, refetch: fetch, addBill, updateBill, markPaid, deleteBill };
}
