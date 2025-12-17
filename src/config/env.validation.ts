import { z } from "zod";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

export const EnvSchema = z.object({
  // Server
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // JWT
  JWT_SECRET: z.string().min(1),
  SUPABASE_JWT_SECRET: z.string().min(1),

  // API
  API_GLOBAL_PREFIX: z.string().default("api"),
  API_ENABLE_VERSIONING: z.string().default("true"),
  API_VERSIONING_TYPE: z.enum(["uri", "header"]).default("uri"),
  API_DEFAULT_VERSION: z.string().default("v1"),
  API_ENABLE_CORS: z.string().default("true"),
  API_CORS_ORIGIN: z.string().optional(),
  API_CORS_CREDENTIALS: z.string().default("true"),
});

type EnvConfig = z.infer<typeof EnvSchema>;

export function validate(config: Record<string, unknown>) {
  const validatedConfig = EnvSchema.safeParse(config);

  if (!validatedConfig.success) {
    throw new Error(
      `Config validation error: ${validatedConfig.error.message}`,
    );
  }

  return validatedConfig.data;
}
