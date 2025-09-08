import { Division } from '../enums/database.enum';

export interface DivisionInfo {
  id: string;
  name: Division;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface DivisionResponse {
  status: string;
  message: string;
  data: DivisionInfo | DivisionInfo[];
}
