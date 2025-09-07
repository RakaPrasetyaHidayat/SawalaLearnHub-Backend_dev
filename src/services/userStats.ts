import { apiClient, User, DivisionStats, ApiResponse } from './api';

// Division mapping
const DIVISION_MAP: Record<string, string> = {
  'ui/ux': 'uiux',
  'uiux': 'uiux',
  'frontend': 'frontend',
  'backend': 'backend',
  'devops': 'devops'
};

// Function to get users statistics by year (angkatan)
export async function getUserStatsByYear(): Promise<Record<string, DivisionStats>> {
  try {
    const response: ApiResponse<User[]> = await apiClient.getAllUsersByDivisions();
    
    if (!response.success || !response.data) {
      console.error('Failed to fetch users:', response.error);
      return {};
    }

    const users = response.data;
    const statsByYear: Record<string, DivisionStats> = {};

    // Group users by angkatan (year)
    users.forEach(user => {
      if (!user.angkatan) return;
      
      const yearKey = `intern-of-sawala-${user.angkatan}`;
      
      if (!statsByYear[yearKey]) {
        statsByYear[yearKey] = {
          all: 0,
          uiux: 0,
          frontend: 0,
          backend: 0,
          devops: 0
        };
      }

      // Increment total count
      statsByYear[yearKey].all++;

      // Increment division-specific count
      if (user.division) {
        const normalizedDivision = DIVISION_MAP[user.division.toLowerCase()];
        if (normalizedDivision && normalizedDivision in statsByYear[yearKey]) {
          (statsByYear[yearKey] as any)[normalizedDivision]++;
        }
      }
    });

    return statsByYear;
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    return {};
  }
}

// Function to get users by specific division
export async function getUsersByDivision(divisionId: string): Promise<User[]> {
  try {
    const response = await apiClient.getUsersByDivision(divisionId);
    
    if (!response.success || !response.data) {
      console.error('Failed to fetch users by division:', response.error);
      return [];
    }

    return response.data.users;
  } catch (error) {
    console.error('Error fetching users by division:', error);
    return [];
  }
}

// Function to get division statistics for a specific year
export async function getDivisionStatsByYear(year: number): Promise<DivisionStats> {
  try {
    const response: ApiResponse<User[]> = await apiClient.getAllUsersByDivisions();
    
    if (!response.success || !response.data) {
      console.error('Failed to fetch users:', response.error);
      return { all: 0, uiux: 0, frontend: 0, backend: 0, devops: 0 };
    }

    const users = response.data.filter(user => user.angkatan === year);
    
    const stats: DivisionStats = {
      all: users.length,
      uiux: 0,
      frontend: 0,
      backend: 0,
      devops: 0
    };

    users.forEach(user => {
      if (user.division) {
        const normalizedDivision = DIVISION_MAP[user.division.toLowerCase()];
        if (normalizedDivision && normalizedDivision in stats) {
          (stats as any)[normalizedDivision]++;
        }
      }
    });

    return stats;
  } catch (error) {
    console.error('Error fetching division statistics:', error);
    return { all: 0, uiux: 0, frontend: 0, backend: 0, devops: 0 };
  }
}