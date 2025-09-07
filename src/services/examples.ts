// Examples of how to use the API client for various data fetching needs

import { apiClient, api } from './api';

// Example 1: Using the API client class methods
export async function loginExample() {
  try {
    const response = await apiClient.login({
      email: 'user@example.com',
      password: 'password123'
    });

    if (response.success) {
      console.log('Login successful:', response.data);
      // Store token, redirect user, etc.
      localStorage.setItem('token', response.data?.token || '');
    } else {
      console.error('Login failed:', response.error);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
}

// Example 2: Using the convenience API functions
export async function fetchUsersExample() {
  try {
    const response = await api.get<any[]>('/api/users');
    
    if (response.success) {
      console.log('Users:', response.data);
      return response.data;
    } else {
      console.error('Failed to fetch users:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// Example 3: Creating a new resource
export async function createResourceExample() {
  try {
    const newResource = {
      title: 'New Learning Resource',
      description: 'This is a sample resource',
      category: 'Programming',
      url: 'https://example.com'
    };

    const response = await api.post('/api/resources', newResource);
    
    if (response.success) {
      console.log('Resource created:', response.data);
      return response.data;
    } else {
      console.error('Failed to create resource:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error creating resource:', error);
    return null;
  }
}

// Example 4: Updating user profile
export async function updateProfileExample() {
  try {
    const profileData = {
      fullName: 'John Doe',
      division: 'Frontend',
      angkatan: 2024
    };

    const response = await apiClient.updateUserProfile(profileData);
    
    if (response.success) {
      console.log('Profile updated:', response.data);
      return response.data;
    } else {
      console.error('Failed to update profile:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
}

// Example 5: Custom endpoint with authentication
export async function fetchProtectedDataExample() {
  try {
    const token = localStorage.getItem('token');
    
    const response = await api.get('/api/protected-endpoint');
    
    if (response.success) {
      console.log('Protected data:', response.data);
      return response.data;
    } else {
      console.error('Failed to fetch protected data:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching protected data:', error);
    return null;
  }
}

// Example 6: Using React hook for data fetching
import { useState, useEffect } from 'react';

export function useApiData<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get<T>(endpoint);
        
        if (response.success) {
          setData(response.data || null);
        } else {
          setError(response.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}

// Example usage of the custom hook:
// const { data: users, loading, error } = useApiData<User[]>('/api/users');