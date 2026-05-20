import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Read .env file manually
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    env[key] = val;
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseAnonKey = env['VITE_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const targetEmail = 'mfathirafa@gmail.com';
  console.log(`Checking database records for user: ${targetEmail}`);

  // We can't select profiles directly because of RLS, but wait, can we select bills or assets?
  // Let's see if we can get anything or if we get permission denied.
  const { data: bills, error: billsError } = await supabase
    .from('bills')
    .select('*');
  
  if (billsError) {
    console.error('Error fetching bills:', billsError);
  } else {
    console.log(`Found ${bills ? bills.length : 0} bills in total (across all users visible to anon, if RLS allows):`, bills);
  }

  const { data: assets, error: assetsError } = await supabase
    .from('assets')
    .select('*');
  
  if (assetsError) {
    console.error('Error fetching assets:', assetsError);
  } else {
    console.log(`Found ${assets ? assets.length : 0} assets in total:`, assets);
  }

  const { data: docs, error: docsError } = await supabase
    .from('legal_docs')
    .select('*');
  
  if (docsError) {
    console.error('Error fetching legal_docs:', docsError);
  } else {
    console.log(`Found ${docs ? docs.length : 0} legal_docs in total:`, docs);
  }
}

check();
