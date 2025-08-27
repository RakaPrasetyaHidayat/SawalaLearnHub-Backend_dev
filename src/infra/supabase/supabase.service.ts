import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const NodeCache = require('node-cache');

import { QueryOptions, StorageOptions } from './supabase.types';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;
  private adminClient: SupabaseClient;
  private cache: any; // keep as any to avoid runtime/typing mismatch
  private apiTimeout: number;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    const supabaseServiceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase configuration');
    }

    this.client = createClient(supabaseUrl, supabaseAnonKey);
    this.adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);
    this.apiTimeout = parseInt(process.env.API_TIMEOUT || '10000');

    this.cache = new NodeCache({
      stdTTL: parseInt(this.configService.get<string>('API_CACHE_EXPIRATION') || '300'),
    });
  }

  public getClient(useAdmin = false): SupabaseClient {
    return useAdmin ? this.adminClient : this.client;
  }

  private async withTimeout<T>(operation: Promise<T>): Promise<T> {
    return Promise.race([
      operation,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), this.apiTimeout)
      ),
    ]);
  }

  // CREATE
  async create<T>(table: string, data: Partial<T>, useAdmin = false): Promise<T> {
    const { data: result, error }: { data: T; error: any } = await this.withTimeout(
      new Promise((resolve, reject) => {
        (this.getClient(useAdmin)
          .from(table)
          .insert(data)
          .select()
          .single() as unknown as Promise<{ data: T; error: any }>)
          .then(resolve)
          .catch(reject);
      })
    );
    if (error) throw error;
    return result;
  }

  // READ ONE
  async findOne<T>(table: string, id: string, useAdmin = false): Promise<T | null> {
    const { data, error }: { data: T | null; error: any } = await this.withTimeout(
      new Promise((resolve, reject) => {
        (this.getClient(useAdmin)
          .from(table)
          .select('*')
          .eq('id', id)
          .single() as unknown as Promise<{ data: T | null; error: any }>)
          .then(resolve)
          .catch(reject);
      })
    );
    if (error) throw error;
    return data;
  }

  // READ MANY
  async findMany<T>(
    table: string,
    options: QueryOptions = {},
    useAdmin = false
  ): Promise<{ data: T[]; count: number }> {
    const { page = 1, limit = 10, orderBy = 'created_at', orderDirection = 'desc' } = options;
    const offset = (page - 1) * limit;

    const { data, count, error }: { data: T[]; count: number; error: any } = await this.withTimeout(
      new Promise((resolve, reject) => {
        (this.getClient(useAdmin)
          .from(table)
          .select('*', { count: 'exact' })
          .order(orderBy, { ascending: orderDirection === 'asc' })
          .range(offset, offset + limit - 1) as unknown as Promise<{ data: T[]; count: number; error: any }>)
          .then(resolve)
          .catch(reject);
      })
    );
    if (error) throw error;

    return { data, count };
  }

  // UPDATE
  async update<T>(table: string, id: string, data: Partial<T>, useAdmin = false): Promise<T> {
    const { data: result, error }: { data: T; error: any } = await this.withTimeout(
      new Promise((resolve, reject) => {
        (this.getClient(useAdmin)
          .from(table)
          .update(data)
          .eq('id', id)
          .select()
          .single() as unknown as Promise<{ data: T; error: any }>)
          .then(resolve)
          .catch(reject);
      })
    );
    if (error) throw error;
    return result;
  }

  // DELETE
  async delete(table: string, id: string, useAdmin = false): Promise<void> {
    const { error }: { error: any } = await this.withTimeout(
      new Promise((resolve, reject) => {
        (this.getClient(useAdmin)
          .from(table)
          .delete()
          .eq('id', id) as unknown as Promise<{ error: any }>)
          .then(resolve)
          .catch(reject);
      })
    );
    if (error) throw error;
  }

  // UPLOAD FILE
  async uploadFile(file: Buffer, fileName: string, options: StorageOptions = {}): Promise<string> {
    const { bucket = 'public', path = '', upsert = false } = options;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const uploadRes = await this.withTimeout(
      // For Node environments, file can be a Buffer. Supabase SDK handles Buffer in Node.
      this.adminClient.storage.from(bucket).upload(filePath, file as any, {
        upsert,
        contentType: this.getContentType(fileName),
      }) as any
    );
    const { error: uploadError } = uploadRes as any;
    if (uploadError) throw uploadError;

    const publicRes = this.adminClient.storage.from(bucket).getPublicUrl(filePath) as any;
    const publicUrl = publicRes?.data?.publicUrl || publicRes?.publicUrl;
    if (!publicUrl) throw new Error('Failed to get public URL for uploaded file');
    return publicUrl;
  }

  async deleteFile(fileName: string, options: StorageOptions = {}): Promise<void> {
    const { bucket = 'public', path = '' } = options;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const res = await this.withTimeout(
      this.adminClient.storage.from(bucket).remove([filePath]) as any
    );
    const { error } = res as any;
    if (error) throw error;
  }

  private getContentType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }
}
