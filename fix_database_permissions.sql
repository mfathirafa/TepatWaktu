-- ============================================================
-- SOLUSI UTAMA: Perbaiki Permission "Permission Denied" di Supabase
-- Jalankan query ini di: Supabase Dashboard > SQL Editor > Run
-- ============================================================

-- 1. Berikan hak akses skema public ke role Supabase
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Berikan izin SELECT, INSERT, UPDATE, DELETE ke semua tabel
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 3. Pastikan tabel baru di masa depan otomatis mendapat izin yang sama
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- 4. Pastikan profil pengguna admin terisi lengkap
INSERT INTO public.profiles (id, email, name, role, subscription_tier)
VALUES (
  '1f0d32d6-41e9-422b-82c1-afe0845ccdd8',
  'mfathirafa@gmail.com',
  'Muhammad Fathi Rafa',
  'admin',
  'premium'
)
ON CONFLICT (id) DO UPDATE 
SET 
  role = 'admin', 
  subscription_tier = 'premium', 
  name = 'Muhammad Fathi Rafa';

-- 5. Konfirmasi email akun langsung (jika belum)
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'mfathirafa@gmail.com';
