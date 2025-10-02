import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../infra/supabase/supabase.service';
import { CreateInternDto, UpdateInternDto, FilterInternsDto } from './dto/intern.dto';
import { Intern } from '../interfaces';

@Injectable()
export class InternsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createInternDto: CreateInternDto): Promise<Intern> {
    const { data: intern, error } = await this.supabaseService.getClient()
      .from('interns')
      .insert(createInternDto)
      .select()
      .single();

    if (error) throw error;
    return intern as Intern;
  }

  async findAll(filterDto: FilterInternsDto) {
    const { angkatan, division_id, status, page = 1, limit = 10 } = filterDto;
    let query = this.supabaseService.getClient()
      .from('interns')
      .select(`
        *,
        users!inner(*),
        divisions!inner(*)
      `);

    if (angkatan) {
      query = query.eq('angkatan', angkatan);
    }

    if (division_id) {
      const maybe = String(division_id).trim();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let resolvedDivisionId: string | undefined;
      if (uuidRegex.test(maybe)) {
        resolvedDivisionId = maybe;
      } else {
        const { data: divisions, error: divErr } = await this.supabaseService
          .getClient(true)
          .from('divisions')
          .select('id,name')
          .ilike('name', maybe);
        if (divErr) throw divErr;
        if (divisions && divisions.length === 1) resolvedDivisionId = divisions[0].id;
        else if (divisions && divisions.length > 1) {
          const exact = divisions.find((d: any) => d.name.toLowerCase() === maybe.toLowerCase());
          if (exact) resolvedDivisionId = exact.id;
          else throw new Error('Multiple divisions matched the provided division name; please provide a division UUID');
        } else {
          const { data: divisions2, error: divErr2 } = await this.supabaseService
            .getClient(true)
            .from('divisions')
            .select('id,name')
            .ilike('name', `%${maybe}%`);
          if (divErr2) throw divErr2;
          if (divisions2 && divisions2.length === 1) resolvedDivisionId = divisions2[0].id;
          else if (divisions2 && divisions2.length > 1) throw new Error('Multiple divisions matched the provided division name; please provide a division UUID');
          else throw new Error('Division not found');
        }
      }
      query = query.eq('division_id', resolvedDivisionId || division_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: interns, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    return {
      interns,
      total: count || 0,
      page,
      limit
    };
  }

  async findOne(id: string): Promise<Intern> {
    const { data: intern, error } = await this.supabaseService.getClient()
      .from('interns')
      .select()
      .eq('id', id)
      .single();
      
    if (error || !intern) {
      throw new NotFoundException('Intern not found');
    }
    
    return intern as Intern;
  }

  async update(id: string, updateInternDto: UpdateInternDto): Promise<Intern> {
    const { data: intern, error } = await this.supabaseService.getClient()
      .from('interns')
      .update(updateInternDto)
      .eq('id', id)
      .select()
      .single();
      
    if (error || !intern) {
      throw new NotFoundException('Intern not found');
    }
    
    return intern as Intern;
  }

  async remove(id: string): Promise<void> {
    const intern = await this.findOne(id);
    await this.supabaseService.delete('interns', id);
  }

  async findByAngkatan(angkatan: number) {
    const { data: interns } = await this.supabaseService.getClient()
      .from('interns')
      .select(`
        *,
        users!inner(*),
        divisions!inner(*)
      `)
      .eq('angkatan', angkatan)
      .order('created_at', { ascending: false });

    return interns;
  }
}
