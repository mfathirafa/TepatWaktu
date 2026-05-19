import { supabase } from './supabase';
import type { Service, ServiceInsert, ServiceUpdate } from '../types';
import { addMonths } from '../lib/dateUtils';

export const servicesService = {
  async getAll(userId: string): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', userId)
      .order('next_service_date', { ascending: true });
    if (error) throw error;
    return data as Service[];
  },

  async create(userId: string, payload: ServiceInsert): Promise<Service> {
    // auto-calculate next_service_date if last_service_date provided
    const next = payload.last_service_date
      ? addMonths(new Date(payload.last_service_date), payload.interval_months).toISOString().split('T')[0]
      : payload.next_service_date;
    const { data, error } = await supabase
      .from('services')
      .insert({ ...payload, next_service_date: next, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data as Service;
  },

  async update(id: string, payload: ServiceUpdate): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Service;
  },

  async markDone(service: Service): Promise<Service> {
    const today = new Date().toISOString().split('T')[0];
    const next = addMonths(new Date(today), service.interval_months).toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('services')
      .update({ last_service_date: today, next_service_date: next, updated_at: new Date().toISOString() })
      .eq('id', service.id)
      .select()
      .single();
    if (error) throw error;
    return data as Service;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
  },
};
