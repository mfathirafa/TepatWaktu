// src/lib/whatsappReminder.ts
// Utility to generate WhatsApp reminder links with professional templates

export function formatWhatsAppPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  return cleaned;
}

export function openWhatsAppReminder(params: {
  phone?: string | null;
  userName?: string;
  itemTitle: string;
  category: 'garansi' | 'tagihan' | 'pajak' | 'servis';
  dueDate: string;
  daysLeft: number;
  amount?: number | null;
  notes?: string | null;
}) {
  const targetPhone = formatWhatsAppPhone(params.phone) || '';
  const name = params.userName || 'Pengguna TepatWaktu';
  
  let header = '🔔 *PENGINGAT RESMI TEPATWAKTU* 🔔';
  let messageBody = '';

  if (params.category === 'garansi') {
    messageBody = `Halo *${name}*,\n\nKami mengingatkan bahwa masa garansi untuk aset:\n📦 *${params.itemTitle}*\n\nAkan berakhir pada tanggal: *${params.dueDate}* (${params.daysLeft <= 0 ? 'Hari ini / Sudah Lewat' : `Sisa ${params.daysLeft} hari lagi`}).\n\nSegera cek kondisi barang Anda ke Service Center resmi jika memerlukan perbaikan sebelum masa garansi habis!`;
  } else if (params.category === 'tagihan') {
    const amountStr = params.amount ? ` sebesar *Rp ${params.amount.toLocaleString('id-ID')}*` : '';
    messageBody = `Halo *${name}*,\n\nPengingat pembayaran tagihan:\n💳 *${params.itemTitle}*${amountStr}\n\nJatuh tempo pada: *${params.dueDate}* (${params.daysLeft <= 0 ? 'Jatuh tempo hari ini!' : `Sisa ${params.daysLeft} hari lagi`}).\n\nHarap selesaikan pembayaran tepat waktu untuk menghindari denda keterlambatan.`;
  } else if (params.category === 'pajak') {
    messageBody = `Halo *${name}*,\n\nPengingat masa berlaku dokumen/pajak:\n📄 *${params.itemTitle}*\n\nMasa berlaku habis pada: *${params.dueDate}* (${params.daysLeft <= 0 ? 'Sudah kedaluwarsa!' : `Sisa ${params.daysLeft} hari lagi`}).\n\nSegera lakukan perpanjangan di kantor samsat/instansi terkait.`;
  } else {
    messageBody = `Halo *${name}*,\n\nJadwal servis berkala untuk:\n🔧 *${params.itemTitle}*\n\nDijadwalkan pada: *${params.dueDate}* (${params.daysLeft <= 0 ? 'Jadwal servis hari ini!' : `Sisa ${params.daysLeft} hari lagi`}).\n\nPastikan aset Anda tetap terawat dengan melakukan servis tepat waktu.`;
  }

  const footer = `\n\n---\n_TepatWaktu - Solusi Cerdas Pengingat & Manajemen Aset Anda_`;
  const fullText = `${header}\n\n${messageBody}${footer}`;
  
  const encodedText = encodeURIComponent(fullText);
  const waUrl = targetPhone 
    ? `https://wa.me/${targetPhone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;

  window.open(waUrl, '_blank');
}
