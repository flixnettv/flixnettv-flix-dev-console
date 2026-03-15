import { createClient } from '@supabase/supabase-js';
import { getEnv } from '../lib/env.js';

const env = getEnv();

export const supabase = env.isConfigured
  ? createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  : null;

export async function insertChatMessage(payload) {
  if (!supabase) {
    return { ok: false, reason: `Missing env: ${env.missing.join(', ')}` };
  }

  const { error } = await supabase.from('chat_messages').insert(payload);
  if (error) return { ok: false, reason: error.message };

  return { ok: true };
}
