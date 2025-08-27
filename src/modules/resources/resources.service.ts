import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../infra/supabase/supabase.service';
import { CreateResourceDto } from './dto/resource.dto';

@Injectable()
export class ResourcesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createResource(createResourceDto: CreateResourceDto, userId: string) {
    const { data: resource, error } = await this.supabaseService.getClient()
      .from('resources')
      .insert({
        ...createResourceDto,
        created_by: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return resource;
  }

  async getResourcesByYear(year: string) {
    const { data: resources, error } = await this.supabaseService.getClient()
      .from('resources')
      .select(`
        *,
        created_by:users(id, full_name, email)
      `)
      .eq('angkatan', year)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return resources;
  }

  async getUserResources(userId: string) {
    const { data: resources, error } = await this.supabaseService.getClient()
      .from('resources')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return resources;
  }
}
