-- ============================================================
-- SQL Script: Set Admin Role for mfathirafa@gmail.com
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

-- Step 1: Cek apakah user sudah ada di profiles
SELECT id, email, name, role, subscription_tier 
FROM public.profiles 
WHERE email = 'mfathirafa@gmail.com';

-- Step 2: Update role ke admin (jalankan ini)
UPDATE public.profiles 
SET 
  role = 'admin', 
  subscription_tier = 'premium',
  name = 'Muhammad Fathi Rafa'
WHERE email = 'mfathirafa@gmail.com';

-- Step 3: Verifikasi update berhasil
SELECT id, email, name, role, subscription_tier, created_at
FROM public.profiles 
WHERE email = 'mfathirafa@gmail.com';
