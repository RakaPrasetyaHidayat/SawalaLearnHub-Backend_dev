import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../../infra/supabase/supabase.service';
import { CreateResourceDto, GetResourcesQueryDto } from './dto/resource.dto';

@Injectable()
export class ResourcesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // helper: normalize nested divisions relation to top-level division_name
  private normalizeDivisionName(resource: any) {
    if (!resource) return resource;
    const div =
      resource.divisions &&
      Array.isArray(resource.divisions) &&
      resource.divisions.length > 0
        ? resource.divisions[0]
        : null;
    if (div && div.name) resource.division_name = div.name;
    if (resource.divisions) delete resource.divisions;
    return resource;
  }

  async createResource(
    createResourceDto: CreateResourceDto,
    userId: string,
    accessToken?: string,
  ) {
    // coba ambil nama lengkap user
    let createdByValue: string = userId;
    try {
      const { data: user, error: userErr } = await this.supabaseService
        .getClient()
        .from('users')
        .select('full_name')
        .eq('id', userId)
        .maybeSingle();
      if (!userErr && user && user.full_name) createdByValue = user.full_name;
    } catch {
      // fallback userId
    }

    // ambil profil user (division_id, channel_year) sebagai default opsional
    let userProfile: { division_id?: string; channel_year?: number } | null =
      null;
    try {
      const { data: u, error: uErr } = await this.supabaseService
        .getClient(true)
        .from('users')
        .select('division_id, channel_year')
        .eq('id', userId)
        .maybeSingle();
      if (!uErr && u) userProfile = u as any;
    } catch {
      // abaikan
    }

    // normalize division_id jika dikirim
    let resolvedDivisionId: string | undefined;
    if (createResourceDto.division_id) {
      const maybe = String(createResourceDto.division_id).trim();
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(maybe)) {
        resolvedDivisionId = maybe;
      } else {
        const { data: divisions, error: divErr } = await this.supabaseService
          .getClient(true)
          .from('divisions')
          .select('id,name')
          .ilike('name', maybe);
        if (divErr) throw divErr;
        if (divisions && divisions.length === 1) {
          resolvedDivisionId = divisions[0].id;
        } else if (divisions && divisions.length > 1) {
          const exact = divisions.find(
            (d: any) => d.name.toLowerCase() === maybe.toLowerCase(),
          );
          if (exact) resolvedDivisionId = exact.id;
          else {
            throw new BadRequestException(
              'Multiple divisions matched the provided division name; please provide a division UUID',
            );
          }
        } else {
          const { data: divisions2, error: divErr2 } =
            await this.supabaseService
              .getClient(true)
              .from('divisions')
              .select('id,name')
              .ilike('name', `%${maybe}%`);
          if (divErr2) throw divErr2;
          if (divisions2 && divisions2.length === 1)
            resolvedDivisionId = divisions2[0].id;
          else if (divisions2 && divisions2.length > 1)
            throw new BadRequestException(
              'Multiple divisions matched the provided division name; please provide a division UUID',
            );
          else resolvedDivisionId = undefined; // biarkan kosong
        }
      }
    }

    // Use admin client to avoid PostgREST role errors when app JWTs contain non-DB roles (e.g., "ADMIN").
    // Security is enforced by Nest guards; DB RLS is satisfied via service role.
    const client = this.supabaseService.getClient(true);

    const payload: any = { ...createResourceDto };
    if (resolvedDivisionId) payload.division_id = resolvedDivisionId;

    // map angkatan -> channel_year
    if (
      typeof createResourceDto.angkatan !== 'undefined' &&
      createResourceDto.angkatan !== null
    ) {
      const n = parseInt(createResourceDto.angkatan as any, 10);
      if (!isNaN(n)) payload.channel_year = n;
      delete payload.angkatan;
    }

    // kalau DTO sudah isi channel_year langsung
    if (
      typeof createResourceDto.channel_year !== 'undefined' &&
      createResourceDto.channel_year !== null &&
      !payload.channel_year
    ) {
      payload.channel_year = Number(createResourceDto.channel_year);
    }

    // kalau masih kosong, coba pakai userProfile (opsional); jika tetap kosong, HAPUS dari payload agar default DB jalan
    if (
      typeof payload.channel_year === 'undefined' ||
      payload.channel_year === null
    ) {
      if (userProfile?.channel_year) {
        payload.channel_year = Number(userProfile.channel_year);
      }
    }

    // kalau division_id masih kosong, coba ambil dari profile (opsional)
    if (!payload.division_id && userProfile?.division_id) {
      const profDiv = String(userProfile.division_id).trim();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(profDiv)) {
        payload.division_id = profDiv;
      } else {
        // userProfile.division_id berisi nama divisi (mis. "DevOps"): resolve ke UUID
        try {
          const { data: divisions, error: divErr } = await this.supabaseService
            .getClient(true)
            .from('divisions')
            .select('id,name')
            .ilike('name', profDiv);
          if (divErr) throw divErr;
          if (divisions && divisions.length === 1) {
            payload.division_id = divisions[0].id;
          } else if (divisions && divisions.length > 1) {
            const exact = divisions.find(
              (d: any) => d.name.toLowerCase() === profDiv.toLowerCase(),
            );
            if (exact) payload.division_id = exact.id;
            // jika masih ambigu, biarkan undefined supaya DB default (all-division) dapat bekerja
          }
        } catch {
          // biarkan undefined jika gagal resolve
        }
      }
    }

    // Bersihkan field optional: jangan kirim bila kosong → biarkan default DB bekerja
    if (payload.channel_year === undefined || payload.channel_year === null) {
      delete payload.channel_year;
    }
    if (!payload.division_id) {
      delete payload.division_id;
    }

    try {
      const { data: resource, error } = await client
        .from('resources')
        .insert({
          ...payload,
          created_by: createdByValue,
          created_by_id: userId,
        })
        .select()
        .single();
      if (error) throw error;
      return this.normalizeDivisionName(resource);
    } catch (e: any) {
      const msg = (e && e.message) || e?.toString?.() || '';
      if (msg.includes('role "') && msg.includes('does not exist')) {
        // fallback admin
        const adminClient = this.supabaseService.getClient(true);
        const payloadAdmin: any = { ...payload };
        const { data: resourceAdmin, error: adminErr } = await adminClient
          .from('resources')
          .insert({
            ...payloadAdmin,
            created_by: createdByValue,
            created_by_id: userId,
          })
          .select()
          .single();
        if (adminErr) throw adminErr;
        return this.normalizeDivisionName(resourceAdmin);
      }
      throw e;
    }
  }

  // Get all resources dengan filter opsional
  async getAllResources(query: GetResourcesQueryDto, accessToken?: string) {
    // Do NOT forward app JWTs to Supabase; they may contain role=ADMIN which is not a DB role.
    // Use admin client for server-side queries to avoid PostgREST role errors.
    const client = this.supabaseService.getClient(true);
    const { year, search, page = 1, limit = 10 } = query || {};

    let resolvedQueryDivisionId: string | undefined;
    if ((query as any)?.division_id) {
      const maybe = String((query as any).division_id).trim();
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(maybe)) {
        resolvedQueryDivisionId = maybe;
      } else {
        const { data: divisions, error: divErr } = await this.supabaseService
          .getClient(true)
          .from('divisions')
          .select('id,name')
          .ilike('name', maybe);
        if (divErr) throw divErr;
        if (divisions && divisions.length === 1)
          resolvedQueryDivisionId = divisions[0].id;
        else if (divisions && divisions.length > 1) {
          const exact = divisions.find(
            (d: any) => d.name.toLowerCase() === maybe.toLowerCase(),
          );
          if (exact) resolvedQueryDivisionId = exact.id;
          else
            throw new BadRequestException(
              'Multiple divisions matched the provided division name; please provide a division UUID',
            );
        }
      }
    }

    let builder = client
      .from('resources')
      .select('*, divisions(name)', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (query?.division_id) {
      builder = builder.eq(
        'division_id',
        resolvedQueryDivisionId || query.division_id,
      );
    }

    if (year) {
      const y = parseInt(year as any, 10);
      if (!isNaN(y)) builder = builder.eq('channel_year', y);
      else builder = builder.eq('channel_year', year);
    }

    if (search) {
      const q = `%${search}%`;
      builder = builder.or(`title.ilike.${q},description.ilike.${q}`);
    }

    const from = (page - 1) * limit;
    const to = page * limit - 1;

    const { data: resources, count, error } = await builder.range(from, to);
    if (error) throw error;
    const normalized = (resources ?? []).map((r: any) =>
      this.normalizeDivisionName(r),
    );
    return { resources: normalized, total: count || 0, page, limit };
  }

  async getResourcesByYear(year: string) {
    const client = this.supabaseService.getClient();
    const y = parseInt(year as any, 10);
    let builder = client
      .from('resources')
      .select('*, divisions(name)')
      .order('created_at', { ascending: false });
    if (!isNaN(y)) builder = builder.eq('channel_year', y);
    else builder = builder.eq('channel_year', year);

    const { data: resources, error } = await builder;
    if (error) throw error;
    return (resources ?? []).map((r: any) => this.normalizeDivisionName(r));
  }

  async getUserResources(userId: string) {
    let createdByValue = userId;
    try {
      const { data: user, error: userErr } = await this.supabaseService
        .getClient(true)
        .from('users')
        .select('full_name')
        .eq('id', userId)
        .maybeSingle();
      if (!userErr && user && user.full_name) createdByValue = user.full_name;
    } catch {
      // fallback
    }

    const { data: resources, error } = await this.supabaseService
      .getClient(true)
      .from('resources')
      .select('*, divisions(name)')
      .eq('created_by', createdByValue)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (resources ?? []).map((r: any) => this.normalizeDivisionName(r));
  }

  async getResourceById(id: string) {
    const { data: resource, error } = await this.supabaseService
      .getClient(true)
      .from('resources')
      .select('*, divisions(name)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    if (!resource) return null;
    return this.normalizeDivisionName(resource);
  }
}
