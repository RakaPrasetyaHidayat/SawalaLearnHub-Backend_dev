import { Injectable } from "@nestjs/common";
import { SupabaseClient, PostgrestError } from "@supabase/supabase-js";
import { SupabaseService } from "../../infra/supabase/supabase.service";
import { PaginationParams, buildPaginationQuery } from "../utils/api.utils";
import { DatabaseFunctions } from "../interfaces/database.functions";

@Injectable()
export class BaseService {
  protected client: SupabaseClient;

  constructor(protected readonly supabaseService: SupabaseService) {
    // Initialize in constructor
    this.initializeClient();
  }

  private async initializeClient() {
    // Wait for next tick to ensure Supabase has time to initialize
    await new Promise((resolve) => setTimeout(resolve, 0));
    this.client = this.supabaseService.getClient();
  }

  protected async callRpc<T extends keyof DatabaseFunctions>(
    functionName: T,
    params?: DatabaseFunctions[T]["Args"],
  ): Promise<DatabaseFunctions[T]["Returns"]> {
    if (!this.client) {
      await this.initializeClient();
    }
    const { data, error } = await this.client.rpc(functionName, params);

    if (error) throw error;
    return data as DatabaseFunctions[T]["Returns"];
  }

  protected async findOne<T>(
    table: string,
    id: string,
    columns = "*",
  ): Promise<T> {
    if (!this.client) {
      await this.initializeClient();
    }
    const { data, error } = await this.client
      .from(table)
      .select<string, T>(columns)
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Record not found");

    return data;
  }

  protected async findMany<T>(
    table: string,
    params: PaginationParams & Record<string, any> = {},
    columns = "*",
  ): Promise<{ data: T[]; total: number }> {
    if (!this.client) {
      await this.initializeClient();
    }
    const { page, pageSize, orderBy, orderDir, ...filters } = params;

    let query = this.client
      .from(table)
      .select<string, T>(columns, { count: "exact" });

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else if (typeof value === "object") {
          Object.entries(value).forEach(([op, val]) => {
            switch (op) {
              case "eq":
                query = query.eq(key, val);
                break;
              case "neq":
                query = query.neq(key, val);
                break;
              case "gt":
                query = query.gt(key, val);
                break;
              case "gte":
                query = query.gte(key, val);
                break;
              case "lt":
                query = query.lt(key, val);
                break;
              case "lte":
                query = query.lte(key, val);
                break;
              case "like":
                query = query.like(key, `%${val}%`);
                break;
              case "ilike":
                query = query.ilike(key, `%${val}%`);
                break;
            }
          });
        } else {
          query = query.eq(key, value);
        }
      }
    });

    // Apply pagination
    query = buildPaginationQuery(query, { page, pageSize, orderBy, orderDir });

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: (data || []) as T[],
      total: count || 0,
    };
  }

  protected async create<T = any>(
    table: string,
    data: Record<string, any>,
  ): Promise<T> {
    const { data: created, error } = await this.client
      .from(table)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return created;
  }

  protected async update<T = any>(
    table: string,
    id: string,
    data: Record<string, any>,
  ): Promise<T> {
    const { data: updated, error } = await this.client
      .from(table)
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!updated) throw new Error("Record not found");

    return updated;
  }

  protected async delete(table: string, id: string): Promise<void> {
    const { error } = await this.client.from(table).delete().eq("id", id);

    if (error) throw error;
  }
}
