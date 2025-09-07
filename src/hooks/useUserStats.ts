import { useState, useEffect } from 'react';
import { getUserStatsByYear, getUsersByDivision, getDivisionStatsByYear } from '../services/userStats';
import { User, DivisionStats } from '../services/api';

// Hook to get user statistics by year
export function useUserStatsByYear() {
  const [data, setData] = useState<Record<string, DivisionStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const stats = await getUserStatsByYear();
        setData(stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user statistics');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await getUserStatsByYear();
      setData(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user statistics');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Hook to get users by division
export function useUsersByDivision(divisionId: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      if (!divisionId) return;
      
      try {
        setLoading(true);
        setError(null);
        const userData = await getUsersByDivision(divisionId);
        setUsers(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [divisionId]);

  const refetch = async () => {
    if (!divisionId) return;
    
    try {
      setLoading(true);
      setError(null);
      const userData = await getUsersByDivision(divisionId);
      setUsers(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, refetch };
}

// Hook to get division statistics for a specific year
export function useDivisionStatsByYear(year: number) {
  const [stats, setStats] = useState<DivisionStats>({ all: 0, uiux: 0, frontend: 0, backend: 0, devops: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        const divisionStats = await getDivisionStatsByYear(year);
        setStats(divisionStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch division statistics');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [year]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const divisionStats = await getDivisionStatsByYear(year);
      setStats(divisionStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch division statistics');
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refetch };
}