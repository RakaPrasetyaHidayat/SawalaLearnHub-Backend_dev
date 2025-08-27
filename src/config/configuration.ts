const parseCorsOrigin = (v?: string): boolean | string[] => {
  if (!v) return true; // Default to true if not specified
  if (v.trim() === '*') return true;
  return v.split(',').map((s) => s.trim()).filter(Boolean);
};

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  jwt: {
    secret: process.env.JWT_SECRET,
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    jwtSecret: process.env.SUPABASE_JWT_SECRET,
  },

  api: {
    globalPrefix: process.env.API_GLOBAL_PREFIX || 'api',
    enableVersioning: process.env.API_ENABLE_VERSIONING !== 'false', // default true
    versioningType: process.env.API_VERSIONING_TYPE || 'uri',
    defaultVersion: process.env.API_DEFAULT_VERSION || 'v1',
    enableCors: process.env.API_ENABLE_CORS !== 'false', // default true
    corsOrigin: parseCorsOrigin(process.env.API_CORS_ORIGIN),
    corsCredentials: process.env.API_CORS_CREDENTIALS === 'true',
  },
});