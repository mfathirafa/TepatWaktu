# LAPORAN ANALISIS PASAR (MARKET ANALYSIS REPORT)
## APLIKASI TEPATWAKTU (Asset & Warranty Management System)

---

## 1. Ringkasan Eksekutif (Executive Summary)

**TepatWaktu** (sebelumnya bernama *Resiku*) adalah aplikasi manajemen aset personal dan pengingat garansi berbasis mobile-first yang dirancang khusus untuk pasar Indonesia. Aplikasi ini memecahkan masalah klasik konsumen Indonesia: hilangnya bukti pembelian (struk belanja fisik), kelupaan masa berlaku garansi barang elektronik/kendaraan, dan ketidaktahuan lokasi service center resmi terdekat saat terjadi kerusakan. 

Dengan menyatukan teknologi **Scan OCR (Optical Character Recognition)** untuk digitalisasi struk belanja, integrasi **WhatsApp Reminder** sebagai media notifikasi langsung tanpa hambatan, serta peta **Service Center** terintegrasi, TepatWaktu hadir sebagai asisten digital harian kelas menengah Indonesia untuk mengamankan dan mengoptimalkan nilai aset mereka.

---

## 2. Segmentasi & Target Pasar (Target Market & Segmentation)

Target pasar TepatWaktu difokuskan pada demografi yang melek teknologi (*tech-savvy*) dengan tingkat konsumsi produk elektronik, gadget, dan peralatan rumah tangga yang tinggi.

*   **Usia:** 18 - 40 tahun (Milenial & Gen Z).
*   **Geografis:** Daerah perkotaan (Urban & Sub-urban) di Indonesia dengan koneksi internet stabil.
*   **Kelas Sosial-Ekonomi:** Kelas Menengah (Middle-class) yang aktif berbelanja gadget dan barang elektronik.
*   **Perilaku & Gaya Hidup:** Sangat mobile-first, menyukai kepraktisan, sering bertransaksi lewat e-commerce, mengutamakan kenyamanan (*convenience*), dan sering memiliki kekhawatiran barang rusak sebelum waktunya atau lupa lokasi klaim garansi.

---

## 3. Estimasi Ukuran Pasar (TAM, SAM, SOM)

Penentuan ukuran pasar didasarkan pada data penetrasi internet, kepemilikan smartphone, dan perilaku belanja e-commerce masyarakat Indonesia per tahun 2025/2026.

1.  **TAM (Total Addressable Market): ~187,7 Juta Pengguna**
    *   Mengacu pada total pengguna smartphone aktif di Indonesia. Ini adalah batas teoritis absolut jika semua orang yang memiliki smartphone menggunakan TepatWaktu untuk mencatat aset mereka.
2.  **SAM (Serviceable Addressable Market): ~60 Juta Pengguna**
    *   Kelompok pengguna smartphone di Indonesia yang aktif berbelanja gadget, elektronik, atau otomotif melalui platform e-commerce (Tokopedia, Shopee, Blibli, dll) dan memiliki kesadaran dasar (*awareness*) akan pentingnya perlindungan garansi produk.
3.  **SOM (Serviceable Obtainable Market): ~600.000 - 1.200.000 Pengguna**
    *   Target pasar awal yang realistis untuk dicapai dalam waktu 2-3 tahun pertama dengan penetrasi 1-2% dari SAM. Target ini dicapai melalui kampanye pemasaran digital bertarget, kerja sama dengan komunitas tech-enthusiast, dan optimasi App Store.

---

## 4. Analisis Kompetitor (Competitor Analysis)

Pasar manajemen garansi di Indonesia masih tergolong *Blue Ocean* (sedikit kompetitor lokal langsung), namun terdapat kompetitor tidak langsung dan aplikasi luar negeri.

| Aspek | Kompetitor Langsung (Global) <br>*(Contoh: Keep Warranty, Stuff)* | Kompetitor Tidak Langsung <br>*(Contoh: Google Drive, Notion)* | **TepatWaktu (Solusi Kita)** |
| :--- | :--- | :--- | :--- |
| **Deskripsi** | Aplikasi pelacak garansi berbasis di luar negeri (AS/Eropa). | Pencatatan manual menggunakan folder Drive atau catatan digital. | Aplikasi manajemen aset lokal dengan alur terintegrasi. |
| **Fitur Utama** | Scan struk, reminder notifikasi aplikasi. | Upload file, organisasi folder manual. | **Scan OCR Struk, WhatsApp Reminder (WAAPI), Lokasi Service Center Resmi Indonesia.** |
| **Metode Pengingat** | Push Notification App (sering diabaikan). | Kalender manual (butuh input manual satu per satu). | **Chat WhatsApp Otomatis (H-30, H-7, H-1) - Tingkat keterbacaan >95%.** |
| **Bahasa & Konten** | Bahasa Inggris, tidak ada database lokal. | Fleksibel, namun menyita waktu setup awal. | **Bahasa Indonesia, database Service Center lokal terlengkap.** |
| **Harga** | Premium/Subskripsi mahal ($2-$5/bulan). | Gratis. | **Freemium (Subs Lokal Terjangkau Rp 9.000/bln).** |

### Keunggulan Kompetitif TepatWaktu:
1.  **Kekuatan Notifikasi WhatsApp:** Pengguna Indonesia cenderung mengabaikan push notification dari aplikasi yang jarang dibuka. Dengan mengirimkan pengingat langsung ke nomor WhatsApp pribadi, peluang klaim garansi yang sukses meningkat secara drastis.
2.  **Kemudahan OCR Bahasa Indonesia:** Deteksi otomatis nama barang dan tanggal garansi dari struk belanja fisik retail lokal (seperti Erafone, IBox, Electronic City, atau struk Tokopedia/Shopee).

---

## 5. Analisis SWOT

### Strengths (Kekuatan):
*   Integrasi unik dengan WhatsApp (WAAPI) untuk pengingat yang andal.
*   Fitur Scan OCR untuk entry data tanpa mengetik panjang.
*   Database service center lokal terintegrasi.
*   Desain antarmuka (UI/UX) minimalis, bersih, dan mudah digunakan.

### Weaknesses (Kelemahan):
*   Brand baru, membutuhkan modal pemasaran untuk membangun reputasi.
*   Ketergantungan pada third-party API (WAAPI & OCR cloud).
*   Tantangan akurasi pembacaan struk belanja jika kualitas foto struk rendah.

### Opportunities (Peluang):
*   Belum ada pemain besar/dominan untuk warranty assistant app di Indonesia.
*   Meningkatnya pembelian barang elektronik bernilai tinggi via online shop.
*   Tingginya kecenderungan masyarakat untuk menggunakan WhatsApp sebagai platform komunikasi utama sehari-hari (~92% pengguna internet aktif).

### Threats (Ancaman):
*   Toko online raksasa (seperti Tokopedia/Shopee) menawarkan garansi tambahan terintegrasi di sistem mereka sendiri saat checkout.
*   Kemungkinan kenaikan harga sewa API gateway WhatsApp yang bisa menaikkan biaya operasional.

---

## 6. Strategi Monetisasi & Pricing (Monetization & Pricing Strategy)

TepatWaktu menerapkan model bisnis **Freemium** untuk memastikan pertumbuhan basis pengguna yang cepat sembari tetap menghasilkan pendapatan operasional yang stabil.

### 1. Free Tier (Gratis dengan Iklan)
*   **Fitur:** Maksimal mencatat 5 aset/garansi secara bersamaan.
*   **Reminder:** Notifikasi dalam aplikasi (in-app notifications).
*   **Monetisasi:** Ad placement (Google Ads) di beberapa halaman strategis seperti Dashboard dan Settings.

### 2. Premium Tier (Berbayar/Subskripsi)
*   **Fitur:** Pencatatan aset tanpa batas, WhatsApp Reminder (H-30, H-7, H-1), ekspor rangkuman aset ke format PDF/Excel, bebas iklan (Ad-free), prioritas proses OCR.
*   **Harga:**
    *   **Paket Bulanan (Monthly):** **Rp 9.000 / bulan**
    *   **Paket Tahunan (Annual):** **Rp 79.000 / tahun** (Diskon lebih dari 25% dibandingkan paket bulanan).

### 3. Rencana Kerja Sama B2B (Masa Depan)
*   Integrasi API dengan platform e-commerce lokal atau toko ritel fisik elektronik. Ketika pembeli membeli barang, opsi "Tambahkan Garansi ke TepatWaktu" akan muncul, memberikan kenyamanan instan bagi pelanggan dan pembagian hasil (revenue share) bagi platform.
