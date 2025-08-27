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
      query = query.eq('division_id', division_id);
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
