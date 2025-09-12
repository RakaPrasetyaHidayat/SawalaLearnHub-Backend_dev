import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../infra/supabase/supabase.service';
import { CreateResourceDto, GetResourcesQueryDto } from './dto/resource.dto';

@Injectable()
export class ResourcesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createResource(createResourceDto: CreateResourceDto, userId: string, accessToken?: string) {
    // try to fetch user's display name (full_name) by id
    let createdByValue: string = userId;
    try {
      const { data: user, error: userErr } = await this.supabaseService
        .getClient()
        .from('users')
        .select('full_name')
        .eq('id', userId)
        .maybeSingle();
      if (!userErr && user && user.full_name) createdByValue = user.full_name;
    } catch (e) {
      // ignore and fallback to userId
    }

    // if division_id not provided, try to resolve it from user's profile
    if (!createResourceDto.division_id) {
      try {
        const { data: u, error: uErr } = await this.supabaseService
          .getClient(true)
          .from('users')
          .select('division_id')
          .eq('id', userId)
          .maybeSingle();
        if (!uErr && u && u.division_id) createResourceDto.division_id = u.division_id;
      } catch (e) {
        // ignore
      }
    }

    const client = accessToken
      ? this.supabaseService.getClientWithAuth(accessToken)
      : this.supabaseService.getClient();

    // build payload and map angkatan -> channel_year if provided
    const payload: any = { ...createResourceDto };
    if (createResourceDto.angkatan) {
      const n = parseInt(createResourceDto.angkatan as any, 10);
      if (!isNaN(n)) payload.channel_year = n;
      delete payload.angkatan;
    }
    // ensure channel_year uses numeric value if provided as channel_year in DTO
    if (createResourceDto.channel_year && !payload.channel_year) payload.channel_year = createResourceDto.channel_year;

    try {
      const { data: resource, error } = await client
        .from('resources')
        .insert({
          ...payload,
          created_by: createdByValue,
        })
        .select()
        .single();

      if (error) throw error;
      return resource;
    } catch (e: any) {
      const msg = (e && e.message) || e?.toString?.() || '';
      // fallback: some DB triggers or policies try to SET ROLE using a custom claim
      // (e.g. 'SISWA') that doesn't exist as a Postgres role which causes insert to fail.
      // In that case, perform insert with admin client and include created_by_id so ownership is recorded.
      if (msg.includes("role \"") && msg.includes('does not exist')) {
        const adminClient = this.supabaseService.getClient(true);
        const payloadAdmin: any = { ...createResourceDto };
        if (createResourceDto.angkatan) {
          const n = parseInt(createResourceDto.angkatan as any, 10);
          if (!isNaN(n)) payloadAdmin.channel_year = n;
          delete payloadAdmin.angkatan;
        }
        if (createResourceDto.channel_year && !payloadAdmin.channel_year) payloadAdmin.channel_year = createResourceDto.channel_year;

        const payload = {
          ...payloadAdmin,
          created_by: createdByValue,
          created_by_id: userId,
        };
        const { data: resourceAdmin, error: adminErr } = await adminClient
          .from('resources')
          .insert(payload)
          .select()
          .single();
        if (adminErr) throw adminErr;
        return resourceAdmin;
      }
      throw e;
    }
  }

  // NEW: Get all resources with optional filter by channel_year
  async getAllResources(query: GetResourcesQueryDto, accessToken?: string) {
    const client = accessToken
      ? this.supabaseService.getClientWithAuth(accessToken)
      : this.supabaseService.getClient();
    const { year, search, page = 1, limit = 10 } = query || {};

    // Debug: log incoming query and whether token-bound client is used
    try {
      console.debug('[ResourcesService] getAllResources called', {
        year,
        search,
        page,
        limit,
        division_id: (query as any)?.division_id,
        hasAccessToken: !!accessToken,
      });
    } catch (logErr) {
      // ignore logging errors
    }

    let builder = client.from('resources').select('*', { count: 'exact' }).order('created_at', { ascending: false });

    if (query?.division_id) builder = builder.eq('division_id', query.division_id);

    if (year) {
      // filter by channel_year only (resources table uses channel_year)
      const y = parseInt(year as any, 10);
      if (!isNaN(y)) builder = builder.eq('channel_year', y);
      else builder = builder.eq('channel_year', year);
    }

    if (search) {
      const q = `%${search}%`;
      // search title or description (case-insensitive)
      builder = builder.or(`title.ilike.${q},description.ilike.${q}`);
    }

    const from = (page - 1) * limit;
    const to = page * limit - 1;

    try {
      const { data: resources, count, error } = await builder.range(from, to);
      if (error) throw error;
      return { resources: resources ?? [], total: count || 0, page, limit };
    } catch (e: any) {
      const msg = (e && e.message) || e?.toString?.() || '';
      if (msg.includes('role "') && msg.includes('does not exist')) {
        // Retry with admin client as a fallback to handle DB triggers/policies that try to SET ROLE
        const adminClient = this.supabaseService.getClient(true);
        let adminBuilder = adminClient.from('resources').select('*', { count: 'exact' }).order('created_at', { ascending: false });
        if (query?.division_id) adminBuilder = adminBuilder.eq('division_id', query.division_id);
        if (year) {
          const y = parseInt(String(year), 10);
          if (!isNaN(y)) adminBuilder = adminBuilder.eq('channel_year', y);
          else adminBuilder = adminBuilder.eq('channel_year', year as any);
        }
        if (search) {
          const q = `%${search}%`;
          adminBuilder = adminBuilder.or(`title.ilike.${q},description.ilike.${q}`);
        }
        const { data: resources, count, error: adminErr } = await adminBuilder.range(from, to);
        if (adminErr) throw adminErr;
        return { resources: resources ?? [], total: count || 0, page, limit };
      }
      throw e;
    }
  }

  async getResourcesByYear(year: string) {
  const client = this.supabaseService.getClient();
  const y = parseInt(year as any, 10);
  let builder = client.from('resources').select('*').order('created_at', { ascending: false });
  if (!isNaN(y)) builder = builder.eq('channel_year', y);
  else builder = builder.eq('channel_year', year);

  try {
    const { data: resources, error } = await builder;
    if (error) throw error;
    return resources;
  } catch (e: any) {
    const msg = (e && e.message) || e?.toString?.() || '';
    if (msg.includes('role "') && msg.includes('does not exist')) {
      const adminClient = this.supabaseService.getClient(true);
      let adminBuilder = adminClient.from('resources').select('*').order('created_at', { ascending: false });
      if (!isNaN(y)) adminBuilder = adminBuilder.eq('channel_year', y);
      else adminBuilder = adminBuilder.eq('channel_year', year as any);
      const { data: resourcesAdmin, error: adminErr } = await adminBuilder;
      if (adminErr) throw adminErr;
      return resourcesAdmin;
    }
    throw e;
  }
  }

  async getUserResources(userId: string) {
    // since created_by now contains user's full_name, fetch it first
    let createdByValue = userId;
    try {
      const { data: user, error: userErr } = await this.supabaseService
        .getClient()
        .from('users')
        .select('full_name')
        .eq('id', userId)
        .maybeSingle();
      if (!userErr && user && user.full_name) createdByValue = user.full_name;
    } catch (e) {
      // fallback to userId
    }

    try {
      const { data: resources, error } = await this.supabaseService.getClient()
        .from('resources')
        .select('*')
        .eq('created_by', createdByValue)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return resources;
    } catch (e: any) {
      const msg = (e && e.message) || e?.toString?.() || '';
      if (msg.includes('role "') && msg.includes('does not exist')) {
        const adminClient = this.supabaseService.getClient(true);
        const { data: resourcesAdmin, error: adminErr } = await adminClient
          .from('resources')
          .select('*')
          .eq('created_by', createdByValue)
          .order('created_at', { ascending: false });
        if (adminErr) throw adminErr;
        return resourcesAdmin;
      }
      throw e;
    }
  }
}
