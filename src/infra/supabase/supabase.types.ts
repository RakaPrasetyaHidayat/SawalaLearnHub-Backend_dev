import { Database } from "../../types/supabase";

export type Tables = Database["public"]["Tables"];
export type Enums = Database["public"]["Enums"];

export interface SupabaseConfig {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export interface StorageOptions {
  bucket?: string;
  path?: string;
  upsert?: boolean;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}
