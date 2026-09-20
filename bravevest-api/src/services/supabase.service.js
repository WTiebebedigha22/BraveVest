// src/services/supabase.service.js — Supabase admin client
// Uses the SERVICE-ROLE secret key. NEVER expose this to the frontend.
// Only used server-side for privileged operations (storage, admin queries).

const { createClient } = require('@supabase/supabase-js');

let adminClient = null;

function getAdminClient() {
  if (adminClient) return adminClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    console.warn('[supabase] Missing SUPABASE_URL or SUPABASE_SECRET_KEY — admin client disabled');
    return null;
  }

  adminClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log('✅ Supabase admin client ready');
  return adminClient;
}

/** Upload a file to Supabase Storage. Returns { path, url }. */
async function uploadFile({ bucket, path, fileBuffer, contentType }) {
  const client = getAdminClient();
  if (!client) throw new Error('Supabase admin not configured');

  const { data, error } = await client.storage
    .from(bucket)
    .upload(path, fileBuffer, { contentType, upsert: true });

  if (error) throw error;

  const { data: signed } = await client.storage
    .from(bucket)
    .createSignedUrl(data.path, 60 * 60 * 24 * 7); // 7 days

  return { path: data.path, url: signed?.signedUrl || null };
}

/** Delete a file from Storage. */
async function deleteFile({ bucket, path }) {
  const client = getAdminClient();
  if (!client) throw new Error('Supabase admin not configured');

  const { error } = await client.storage.from(bucket).remove([path]);
  if (error) throw error;
  return true;
}

/** Health check — returns true if Supabase is reachable. */
async function ping() {
  const client = getAdminClient();
  if (!client) return false;
  try {
    const { error } = await client.from('_ping').select('*').limit(1).maybeSingle();
    // Any response (including empty) means reachable
    return true;
  } catch {
    return false;
  }
}

module.exports = { getAdminClient, uploadFile, deleteFile, ping };
