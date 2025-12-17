// supabase.service.ts
import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient; // anon
  private adminClient: SupabaseClient; // service role

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const { url, anonKey, serviceRoleKey } = this.configService.supabaseConfig;

    if (!url) throw new Error("❌ Missing Supabase URL");
    if (!anonKey) throw new Error("❌ Missing Supabase Anon Key");
    if (!serviceRoleKey)
      throw new Error("❌ Missing Supabase Service Role Key");

    this.client = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    this.adminClient = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    console.log("✅ Supabase initialized");
  }

  public getClient(useAdmin = false): SupabaseClient {
    const client = useAdmin ? this.adminClient : this.client;
    if (!client) {
      throw new Error(
        `Supabase ${useAdmin ? "admin " : ""}client not initialized`,
      );
    }
    return client;
  }

  /**
   * Create a Supabase client that includes user's access token in Authorization header.
   * This client can be used to perform actions as the authenticated user (useful for RLS policies).
   */
  public getClientWithAuth(accessToken: string): SupabaseClient {
    const { url, anonKey } = this.configService.supabaseConfig;
    if (!url || !anonKey) throw new Error("Supabase not configured");
    return createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
  }

  // =============================
  // AUTH
  // =============================

  async register(email: string, password: string) {
    const { data, error } = await this.client.auth.signUp({ email, password });
    if (error) {
      console.error("❌ Register error:", error.message);
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  async login(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("❌ Login error:", error.message);
      throw new UnauthorizedException("Invalid email or password");
    }
    return data;
  }

  async logout() {
    const { error } = await this.client.auth.signOut();
    if (error) throw new InternalServerErrorException(error.message);
    return { message: "Logged out successfully" };
  }

  async getUser(accessToken: string) {
    const { data, error } = await this.client.auth.getUser(accessToken);
    if (error) {
      console.error("❌ GetUser error:", error.message);
      throw new UnauthorizedException("Invalid or expired token");
    }
    return data.user;
  }

  // =============================
  // CRUD
  // =============================

  async create<T>(
    table: string,
    data: Partial<T>,
    useAdmin = false,
  ): Promise<T> {
    const { data: result, error } = await this.getClient(useAdmin)
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error(`❌ Create error on ${table}:`, error.message);
      throw new InternalServerErrorException(error.message);
    }
    return result as T;
  }

  async findOne<T>(
    table: string,
    id: string,
    useAdmin = false,
  ): Promise<T | null> {
    const { data, error } = await this.getClient(useAdmin)
      .from(table)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`❌ FindOne error on ${table}:`, error.message);
      throw new InternalServerErrorException(error.message);
    }
    return data as T;
  }

  async findMany<T>(table: string, limit = 10, useAdmin = false): Promise<T[]> {
    const { data, error } = await this.getClient(useAdmin)
      .from(table)
      .select("*")
      .limit(limit);

    if (error) {
      console.error(`❌ FindMany error on ${table}:`, error.message);
      throw new InternalServerErrorException(error.message);
    }
    return data as T[];
  }

  async update<T>(
    table: string,
    id: string,
    data: Partial<T>,
    useAdmin = false,
  ): Promise<T> {
    const { data: result, error } = await this.getClient(useAdmin)
      .from(table)
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`❌ Update error on ${table}:`, error.message);
      throw new InternalServerErrorException(error.message);
    }
    return result as T;
  }

  async delete(table: string, id: string, useAdmin = false): Promise<void> {
    const { error } = await this.getClient(useAdmin)
      .from(table)
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`❌ Delete error on ${table}:`, error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
