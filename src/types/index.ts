// ============================================================
// Central type definitions for TEPATWAKTU
// ============================================================

export interface Profile {
  id: string;
  name: string | null;
  email: string;
  whatsapp: string | null;
  avatar_url: string | null;
  subscription_tier: 'free' | 'premium';
  role: 'admin' | 'customer';
  created_at: string;
  updated_at: string;
}

// ---------- Bills ----------
export interface Bill {
  id: string;
  user_id: string;
  name: string;
  category: 'listrik' | 'internet' | 'air' | 'cicilan' | 'hiburan' | 'lainnya';
  amount: number | null;
  due_day: number;         // day of month (1-31)
  due_date: string;        // current period due date (ISO date)
  status: 'unpaid' | 'paid';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type BillInsert = Omit<Bill, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type BillUpdate = Partial<BillInsert>;

// ---------- Legal Docs (Pajak) ----------
export interface LegalDoc {
  id: string;
  user_id: string;
  name: string;
  doc_number: string | null;
  category: 'sim' | 'stnk' | 'pbb' | 'paspor' | 'lainnya';
  expiry_date: string;     // ISO date
  amount: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type LegalDocInsert = Omit<LegalDoc, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type LegalDocUpdate = Partial<LegalDocInsert>;

// ---------- Services ----------
export interface Service {
  id: string;
  user_id: string;
  name: string;
  provider: string | null;
  interval_months: number;
  last_service_date: string | null;
  next_service_date: string;  // ISO date
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ServiceInsert = Omit<Service, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type ServiceUpdate = Partial<ServiceInsert>;

// ---------- Assets & Warranties ----------
export interface Asset {
  id: string;
  user_id: string;
  name: string;
  brand: string | null;
  category: string | null;
  purchase_date: string | null;
  price: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  warranties?: Warranty[];
}

export interface Warranty {
  id: string;
  asset_id: string;
  expiry_date: string;
  duration_months: number | null;
  status: 'active' | 'expiring' | 'expired';
  created_at: string;
  updated_at: string;
}

export type AssetInsert = Omit<Asset, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'warranties'>;
export type WarrantyInsert = Omit<Warranty, 'id' | 'created_at' | 'updated_at'>;

// ---------- Notifications ----------
export interface Notification {
  id: string;
  user_id: string;
  asset_id: string | null;
  type: string;
  message?: string;
  title?: string;
  is_read: boolean;
  sent_at: string;
}

// ---------- Urgency Helpers ----------
export type UrgencyLevel = 'critical' | 'warning' | 'safe';

export function getUrgency(isoDateStr: string): UrgencyLevel {
  const days = Math.ceil(
    (new Date(isoDateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (days <= 3) return 'critical';
  if (days <= 7) return 'warning';
  return 'safe';
}

export function getDaysLeft(isoDateStr: string): number {
  return Math.ceil(
    (new Date(isoDateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
}

export function urgencyColor(level: UrgencyLevel) {
  if (level === 'critical') return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', bar: 'bg-red-500', badge: 'bg-red-600' };
  if (level === 'warning')  return { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100', bar: 'bg-yellow-500', badge: 'bg-yellow-600' };
  return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', bar: 'bg-emerald-500', badge: 'bg-emerald-600' };
}

export function formatCurrency(amount: number | null): string {
  if (amount === null) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export function formatDate(isoDate: string | null): string {
  if (!isoDate) return '-';
  return new Date(isoDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
