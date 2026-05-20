<div align="center">
  <img src="https://api.dicebear.com/7.x/shapes/svg?seed=Ingetin&backgroundColor=3525cd" alt="Ingetin Logo" width="120" height="120" style="border-radius: 24px; margin-bottom: 20px; box-shadow: 0 10px 25px rgba(53, 37, 205, 0.2);" />
  
  # 📦 Ingetin
  
  **Super App Manajemen Aset, Garansi, Tagihan, & Dokumen Pribadi**
  
  [![React](https://img.shields.io/badge/React-19-blue.svg?style=flat&logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-6-purple.svg?style=flat&logo=vite)](https://vitejs.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E.svg?style=flat&logo=supabase)](https://supabase.com/)

  *Simpan, Lacak, dan Kelola segala kebutuhan administratif pribadi Anda dalam satu genggaman, didesain dengan UI premium ala mobile-first!*

</div>

<br />

## 🌟 Tentang Aplikasi

**Ingetin** adalah aplikasi _all-in-one_ yang dirancang khusus untuk mempermudah hidup Anda dalam mengingat dan mengelola hal-hal penting yang sering terlupakan. Apakah itu batas waktu tagihan listrik bulanan, jadwal servis kendaraan, masa berlaku paspor, hingga tanggal habisnya garansi laptop kesayangan—semua dapat dilacak dan diingatkan oleh Ingetin.

Menggunakan pendekatan antarmuka bergaya *Glassmorphism* modern dan tata letak *Mobile-first*, aplikasi ini memastikan pengalaman pengguna yang sangat premium dan intuitif di berbagai ukuran perangkat keras.

---

## 🚀 Fitur Utama

- **📊 Dashboard Interaktif**: Pantau sekilas seluruh urgensi dari tagihan, dokumen yang akan kedaluwarsa, dan jadwal servis dalam tampilan kartu-kartu yang estetik.
- **🛡️ Manajemen Garansi & Aset**: Simpan daftar barang elektronik/aset berharga lengkap dengan informasi pembelian, harga, dan hitung mundur otomatis masa garansi secara persis.
- **🧾 Pengingat Tagihan & Servis**: Catat semua kewajiban bulanan (listrik, internet, asuransi) dan jadwal servis kendaraan Anda dengan sistem status lunas/belum lunas.
- **📁 Pusat Dokumen (Digital Vault)**: Arsip digital rapi untuk menyimpan informasi KTP, SIM, STNK, Paspor, dan Sertifikat penting dengan indikator warna (merah/kuning/hijau) berdasarkan jarak kedaluwarsa.
- **🔔 Sistem Notifikasi Cerdas**: Pemberitahuan otomatis ketika garansi tinggal 30, 7, atau 1 hari lagi, serta notifikasi saat batas waktu tagihan semakin dekat.
- **🔒 Keamanan Berbasis Supabase RLS**: Dilengkapi sistem autentikasi *(Login/Register)* dan **Row-Level Security (RLS)** yang ketat; menjamin data Anda tidak bisa diintip atau diubah oleh akun lain.
- **✨ Fitur Seeding Developer (Muat Data Sampel)**: Bagi pengembang atau penguji aplikasi, tersedia fitur satu klik di menu Pengaturan untuk mempopulasi seluruh database dengan puluhan data sampel realistis (Bahasa Indonesia).

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) | Library UI komponen modern berbasis *Hooks*. |
| **Build Tool** | [Vite 6](https://vitejs.dev/) | Bundler super cepat untuk pengembangan dan kompilasi HMR. |
| **Bahasa Pemrograman** | [TypeScript](https://www.typescriptlang.org/) | Pengetikan statis yang aman (Type-safe). |
| **Styling & Desain** | [Tailwind CSS v4](https://tailwindcss.com/) | Framework utility-first untuk desain *responsive* & *aesthetic*. |
| **Ikon UI** | [Lucide React](https://lucide.dev/) | Kumpulan ikon vektor minimalis nan cantik. |
| **Backend & Database** | [Supabase](https://supabase.com/) | PostgreSQL-as-a-Service, sistem Autentikasi, dan RLS terintegrasi penuh. |
| **Routing** | [React Router DOM](https://reactrouter.com/) | Navigasi halaman antar komponen. |

---

## ⚙️ Persyaratan Sistem (*Prerequisites*)

Sebelum Anda memulai instalasi, pastikan Anda telah memiliki:
1. **Node.js** (Disarankan versi v18.x atau terbaru).
2. **NPM** atau **Yarn** atau **PNPM** sebagai package manager.
3. Akun **Supabase** (Gratis di [supabase.com](https://supabase.com)) untuk membangun backend secara instan.

---

## 📦 Panduan Instalasi & Menjalankan Aplikasi

Ikuti panduan ini langkah demi langkah untuk menjalankan Ingetin di mesin lokal Anda:

### 1. Kloning Repositori
```bash
git clone https://github.com/username/ingetin.git
cd ingetin
```

### 2. Instalasi Dependensi
Jalankan perintah berikut untuk mengunduh semua library yang dibutuhkan:
```bash
npm install
```

### 3. Konfigurasi Backend (Supabase)
1. Buat proyek baru di [Supabase Dashboard](https://supabase.com/dashboard).
2. Buka menu **SQL Editor** pada Supabase.
3. Salin (copy) seluruh isi teks dari berkas `supabase_schema.sql` yang ada di root repositori ini.
4. Tempel (paste) ke dalam kolom SQL Editor di Supabase, lalu jalankan (**Run**). *Langkah ini akan langsung membuat seluruh tabel, trigger keamanan, hingga kebijakan RLS (Row-Level Security).*
5. (Opsional namun Penting): Jangan lupa juga untuk menjalankan izin akses publik di SQL Editor agar aplikasi dapat melakukan aksi Select/Insert:
   ```sql
   GRANT ALL ON TABLE public.profiles TO authenticated, anon;
   GRANT ALL ON TABLE public.assets TO authenticated, anon;
   GRANT ALL ON TABLE public.receipts TO authenticated, anon;
   GRANT ALL ON TABLE public.warranties TO authenticated, anon;
   GRANT ALL ON TABLE public.notifications TO authenticated, anon;
   GRANT ALL ON TABLE public.bills TO authenticated, anon;
   GRANT ALL ON TABLE public.services TO authenticated, anon;
   GRANT ALL ON TABLE public.legal_docs TO authenticated, anon;
   GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;
   ```

### 4. Konfigurasi Environment Variables (`.env`)
1. Buat file baru dengan nama `.env` di folder paling luar (root).
2. Isi file tersebut dengan kredensial dari project Supabase Anda (bisa didapatkan di **Project Settings -> API**):
   ```env
   VITE_SUPABASE_URL=https://<project-id>.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 5. Jalankan Development Server
Mulai eksekusi aplikasi dalam mode pengembangan lokal:
```bash
npm run dev
```
Aplikasi kini dapat diakses melalui browser Anda di `http://localhost:5173`.

---

## 💡 Developer Seeding (Data Sampel Cepat)

Ingin melihat tampilan UI aplikasi terisi dengan data secara instan tanpa mengetik manual? 
1. Jalankan aplikasi dan **Daftar/Login** menggunakan email Anda.
2. Masuk ke halaman **Profil / Pengaturan** dari *Bottom Navigation*.
3. Gulir ke bawah hingga Anda melihat area **DEVELOPER OPTIONS**.
4. Klik tombol **Muat Data Sampel Lengkap**. 
5. Terima konfirmasi yang muncul, dan dalam seketika seluruh *dashboard*, *pusat dokumen*, *tagihan*, dan *notifikasi* Anda akan terisi oleh contoh data berbahasa Indonesia yang sangat lengkap (Tagihan PLN, PBB, Pajak Mobil, Garansi iPhone, dsb).

---

## 📄 Skrip CLI Tersedia
Di dalam `package.json`, kami menyediakan beberapa skrip pembantu:
- `npm run dev` : Menjalankan web server lokal.
- `npm run build` : Mengkompilasi dan mem-build project untuk produksi (*production-ready*).
- `npm run preview` : Menjalankan build folder lokal untuk pengujian pra-produksi.
- `npm run lint` : Menjalankan analisa ESLint untuk merapikan aturan TypeScript dan React.

---

<div align="center">
  Dibuat dengan ❤️ oleh <b>Tim Ingetin</b>. <br />
  Hak Cipta &copy; 2026 Seluruh Hak Dilindungi.
</div>
