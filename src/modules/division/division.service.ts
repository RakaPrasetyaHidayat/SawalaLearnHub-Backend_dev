import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../../infra/supabase/supabase.service";
import { Division } from "../../common/enums/database.enum";
import {
  DivisionInfo,
  DivisionResponse,
} from "../../common/interfaces/division.interface";
import { handleDbError } from "../../common/utils/database.utils";

@Injectable()
export class DivisionService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAllDivisions(): Promise<DivisionResponse> {
    try {
      const { data: divisions, error } = await this.supabaseService
        .getClient(true)
        .from("divisions")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        throw handleDbError(error);
      }

      return {
        status: "success",
        message: "Divisions retrieved successfully",
        data: divisions,
      };
    } catch (error) {
      throw handleDbError(error);
    }
  }

  async getDivisionById(id: string): Promise<DivisionResponse> {
    try {
      const { data: division, error } = await this.supabaseService
        .getClient(true)
        .from("divisions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw handleDbError(error);
      }

      return {
        status: "success",
        message: "Division retrieved successfully",
        data: division,
      };
    } catch (error) {
      throw handleDbError(error);
    }
  }

  async createDivision(
    name: Division,
    description: string,
  ): Promise<DivisionResponse> {
    try {
      const { data: division, error } = await this.supabaseService
        .getClient(true)
        .from("divisions")
        .insert([
          {
            name,
            description,
          },
        ])
        .select()
        .single();

      if (error) {
        throw handleDbError(error);
      }

      return {
        status: "success",
        message: "Division created successfully",
        data: division,
      };
    } catch (error) {
      throw handleDbError(error);
    }
  }

  async updateDivision(
    id: string,
    description: string,
  ): Promise<DivisionResponse> {
    try {
      const { data: division, error } = await this.supabaseService
        .getClient(true)
        .from("divisions")
        .update({ description })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw handleDbError(error);
      }

      return {
        status: "success",
        message: "Division updated successfully",
        data: division,
      };
    } catch (error) {
      throw handleDbError(error);
    }
  }

  async deleteDivision(id: string): Promise<DivisionResponse> {
    try {
      const { data: division, error } = await this.supabaseService
        .getClient(true)
        .from("divisions")
        .delete()
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw handleDbError(error);
      }

      return {
        status: "success",
        message: "Division deleted successfully",
        data: division,
      };
    } catch (error) {
      throw handleDbError(error);
    }
  }
}
