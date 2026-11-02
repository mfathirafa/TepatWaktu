// Script to create admin account via Supabase
// Run: node create_admin.js (from project root)

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hfpunhgqifcwvjanqaih.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcHVuaGdxaWZjd3ZqYW5xYWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1ODI5MzQsImV4cCI6MjEwOTE1ODkzNH0.1jMMGxXkwG7HlrdTX8UmOllMvz3G-xgArYTfkMn3kDc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_EMAIL = 'mfathirafa@gmail.com';
const ADMIN_PASSWORD = 'akhirhayat';
const ADMIN_FULLNAME = 'Muhammad Fathi Rafa';

async function createAdminAccount() {
  console.log('📦 Mencoba mendaftar akun admin...');
  
  // Step 1: Sign up the account
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    options: {
      data: {
        full_name: ADMIN_FULLNAME,
      }
    }
  });

  if (signUpError) {
    if (signUpError.message.includes('already registered') || signUpError.message.includes('already been registered')) {
      console.log('⚠️  Email sudah terdaftar. Mencoba login dan update role...');
      
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });
      
      if (loginError) {
        console.error('❌ Gagal login:', loginError.message);
        return;
      }
      
      console.log('✅ Login berhasil, user ID:', loginData.user.id);
      await updateToAdmin(loginData.user.id);
      return;
    }
    
    console.error('❌ Gagal mendaftar:', signUpError.message);
    return;
  }

  if (!signUpData.user) {
    console.log('⚠️  Akun perlu konfirmasi email. User ID dari sesi:', signUpData.session?.user?.id || 'N/A');
    console.log('📋 Jalankan SQL ini di Supabase Dashboard > SQL Editor untuk set role admin:');
    console.log(`\nUPDATE public.profiles SET role = 'admin', subscription_tier = 'premium', name = '${ADMIN_FULLNAME}' WHERE email = '${ADMIN_EMAIL}';\n`);
    return;
  }

  console.log('✅ Akun berhasil dibuat! User ID:', signUpData.user.id);
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  await updateToAdmin(signUpData.user.id);
}

async function updateToAdmin(userId) {
  console.log(`\n🔧 Mengupdate role ke 'admin' untuk user ID: ${userId}`);
  
  const { data: existingProfile, error: checkError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('❌ Gagal cek profile:', checkError.message);
    return;
  }

  if (!existingProfile) {
    console.log('Profile belum ada, membuat profile baru...');
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: ADMIN_EMAIL,
        name: ADMIN_FULLNAME,
        role: 'admin',
        subscription_tier: 'premium',
      });
    
    if (insertError) {
      console.error('❌ Gagal membuat profile:', insertError.message);
      console.log('\n📋 Jalankan SQL ini di Supabase Dashboard > SQL Editor:');
      console.log(`INSERT INTO public.profiles (id, email, name, role, subscription_tier) VALUES ('${userId}', '${ADMIN_EMAIL}', '${ADMIN_FULLNAME}', 'admin', 'premium');`);
    } else {
      console.log('✅ Profile admin berhasil dibuat!');
      printSuccess();
    }
    return;
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'admin', subscription_tier: 'premium', name: ADMIN_FULLNAME })
    .eq('id', userId);

  if (updateError) {
    console.error('❌ Gagal update role (mungkin RLS). Jalankan SQL ini di Supabase Dashboard:');
    console.log(`\nUPDATE public.profiles SET role = 'admin', subscription_tier = 'premium', name = '${ADMIN_FULLNAME}' WHERE id = '${userId}';\n`);
  } else {
    console.log('✅ Role berhasil diupdate ke admin!');
    printSuccess();
  }
}

function printSuccess() {
  console.log('\n🎉 Selesai! Akun admin siap digunakan:');
  console.log(`   Email   : ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`   Role    : admin`);
  console.log(`   Tier    : premium`);
}

createAdminAccount().catch(console.error);
