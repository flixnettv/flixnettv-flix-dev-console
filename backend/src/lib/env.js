const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

export function getEnv() {
  const missing = required.filter((key) => !process.env[key]);

  return {
    port: Number(process.env.PORT || 8787),
    corsOrigin: process.env.CORS_ORIGIN || '*',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    isConfigured: missing.length === 0,
    missing
  };
}
