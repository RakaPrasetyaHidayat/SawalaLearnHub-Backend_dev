// supabase.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient;       // pakai anon key
  private adminClient: SupabaseClient;  // pakai service role key

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const { url, anonKey, serviceRoleKey } = this.configService.supabaseConfig;

    if (!url) throw new Error('❌ Missing Supabase URL');
    if (!anonKey) throw new Error('❌ Missing Supabase Anon Key');
    if (!serviceRoleKey) throw new Error('❌ Missing Supabase Service Role Key');

    // ✅ Client user (anon)
    this.client = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // ✅ Client admin (service role)
    this.adminClient = createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    console.log('✅ Supabase initialized');
  }

  public getClient(useAdmin = false): SupabaseClient {
    const client = useAdmin ? this.adminClient : this.client;
    if (!client) {
      throw new Error(`Supabase ${useAdmin ? 'admin ' : ''}client not initialized`);
    }
    return client;
  }

  // =============================
  // AUTHENTICATION
  // =============================

  async register(email: string, password: string) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async login(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async logout() {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
    return { message: 'Logged out successfully' };
  }

  async getUser(accessToken: string) {
    const { data, error } = await this.client.auth.getUser(accessToken);
    if (error) throw error;
    return data.user;
  }

  // =============================
  // CRUD METHODS
  // =============================

  async create<T>(table: string, data: Partial<T>, useAdmin = false): Promise<T> {
    const { data: result, error } = await this.getClient(useAdmin)
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result as T;
  }

  async findOne<T>(table: string, id: string, useAdmin = false): Promise<T | null> {
    const { data, error } = await this.getClient(useAdmin)
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as T;
  }

  async findMany<T>(table: string, limit = 10, useAdmin = false): Promise<T[]> {
    const { data, error } = await this.getClient(useAdmin)
      .from(table)
      .select('*')
      .limit(limit);

    if (error) throw error;
    return data as T[];
  }

  async update<T>(table: string, id: string, data: Partial<T>, useAdmin = false): Promise<T> {
    const { data: result, error } = await this.getClient(useAdmin)
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result as T;
  }

  async delete(table: string, id: string, useAdmin = false): Promise<void> {
    const { error } = await this.getClient(useAdmin)
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
