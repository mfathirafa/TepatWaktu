import { supabase } from './supabase';
import type { Bill, BillInsert, BillUpdate } from '../types';
import { addMonths, format } from '../lib/dateUtils';

export const billsService = {
  async getAll(userId: string): Promise<Bill[]> {
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true });
    if (error) throw error;
    return data as Bill[];
  },

  async create(userId: string, payload: BillInsert): Promise<Bill> {
    const { data, error } = await supabase
      .from('bills')
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data as Bill;
  },

  async update(id: string, payload: BillUpdate): Promise<Bill> {
    const { data, error } = await supabase
      .from('bills')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Bill;
  },

  async markPaid(bill: Bill): Promise<Bill> {
    // Shift due_date forward by 1 month and set status back to unpaid for next cycle
    const nextDue = addMonths(new Date(bill.due_date), 1);
    const { data, error } = await supabase
      .from('bills')
      .update({
        status: 'paid',
        updated_at: new Date().toISOString(),
        // keep next_due_date as a record; user can reset
      })
      .eq('id', bill.id)
      .select()
      .single();
    if (error) throw error;
    // Also log to notifications
    await supabase.from('notifications').insert({
      user_id: bill.user_id,
      type: 'bill_paid',
      title: `Tagihan ${bill.name} Lunas`,
      message: `Tagihan ${bill.name} untuk periode ini telah ditandai lunas. Jatuh tempo berikutnya: ${format(nextDue)}.`,
      is_read: false,
    });
    return data as Bill;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('bills').delete().eq('id', id);
    if (error) throw error;
  },
};
