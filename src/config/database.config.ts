import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class DatabaseConfig {
  static readonly TIMEOUT = 5000; // 5 seconds
  static readonly MAX_ROWS = 100;
  
  static configureClient(client: SupabaseClient): SupabaseClient {
    // Add timeout to all requests
    const originalFrom = client.from.bind(client);
    client.from = (table: string) => {
      const query = originalFrom(table);
      const originalSelect = query.select.bind(query);
      
      query.select = (...args: any[]) => {
        const selectQuery = originalSelect(...args);
        return selectQuery.timeout(DatabaseConfig.TIMEOUT);
      };
      
      return query;
    };
    
    return client;
  }
}
