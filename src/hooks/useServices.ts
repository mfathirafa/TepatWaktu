import { useCallback, useEffect, useState } from 'react';
import { servicesService } from '../services/servicesService';
import { useAuth } from '../context/AuthContext';
import type { Service, ServiceInsert, ServiceUpdate } from '../types';

export function useServices() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await servicesService.getAll(user.id);
      setServices(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const addService = async (payload: ServiceInsert) => {
    if (!user) return;
    const newSvc = await servicesService.create(user.id, payload);
    setServices(prev => [newSvc, ...prev]);
  };

  const updateService = async (id: string, payload: ServiceUpdate) => {
    const updated = await servicesService.update(id, payload);
    setServices(prev => prev.map(s => s.id === id ? updated : s));
  };

  const markDone = async (service: Service) => {
    const updated = await servicesService.markDone(service);
    setServices(prev => prev.map(s => s.id === service.id ? updated : s));
  };

  const deleteService = async (id: string) => {
    await servicesService.delete(id);
    setServices(prev => prev.filter(s => s.id !== id));
  };

  return { services, loading, error, refetch: fetch, addService, updateService, markDone, deleteService };
}
