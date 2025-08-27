import { ResourceType } from '../../../common/enums';

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  created_by: string;
  channel_year: number;
  created_at: Date;
}

export interface ResourceWithProfile extends Resource {
  profile: {
    full_name: string;
  };
}
