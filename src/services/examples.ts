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
    const response = await apiClient.getUsers();
    if (response.success) {
      return response.data || [];
    }
    return [];
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

    // No direct create resource API on apiClient; fallback to createPost for demo
  const resp = await api.createPost(newResource as any).catch(() => null);
  return resp;
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
    
    // use apiClient.getAllUsersByDivisions as a proxy example
    const response = await apiClient.getAllUsersByDivisions();
    if (response.success) return response.data || null;
    return null;
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
        
        // Use request wrapper via apiClient where applicable. For generic endpoints fall back to fetch
        try {
          const raw = await fetch(endpoint, { credentials: 'same-origin' });
          const json = await raw.json().catch(() => null);
          setData(json as T | null);
        } catch (e) {
          setError('Failed to fetch data');
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

// New API Examples - Task Submission and User Management

// Example 7: Get users by division (per channel_year)
export async function fetchUsersByDivisionExample() {
  try {
    // Import the function
    const { fetchUsersByDivision } = await import('./userService');

    // Get users from a specific division for a specific year
    const divisionId = '00000000-0000-0000-0000-000000000000'; // Replace with actual division UUID
    const year = 2025;

    const users = await fetchUsersByDivision(divisionId, year);
    console.log('Users by division and year:', users);
    return users;
  } catch (error) {
    console.error('Error fetching users by division:', error);
    return null;
  }
}

// Example 8: Get division counts per year (without year parameter)
export async function fetchDivisionCountsExample() {
  try {
    const { fetchUsersByDivision } = await import('./userService');

    const divisionId = '00000000-0000-0000-0000-000000000000'; // Replace with actual division UUID

    // Without year parameter, gets grouped counts per channel_year
    const counts = await fetchUsersByDivision(divisionId);
    console.log('Division counts per year:', counts);
    return counts;
  } catch (error) {
    console.error('Error fetching division counts:', error);
    return null;
  }
}

// Example 9: Approve user (admin only)
export async function approveUserExample() {
  try {
    const { approveUser } = await import('./userService');

    const userId = 'user-uuid-here'; // Replace with actual user ID
    const role = 'SISWA'; // or 'ADMIN'

    const result = await approveUser(userId, role);
    console.log('User approved:', result);
    return result;
  } catch (error) {
    console.error('Error approving user:', error);
    return null;
  }
}

// Example 10: Get task submission for current user by taskId
export async function getTaskSubmissionExample() {
  try {
    const { TasksService } = await import('./tasksService');

    const taskId = 'task-uuid-here'; // Replace with actual task ID

    const submission = await TasksService.getTaskSubmissionByTaskId(taskId);
    console.log('Task submission:', submission);
    // submission contains: id, task_id, user_id, description, file_urls, submission_status, etc.
    return submission;
  } catch (error) {
    console.error('Error fetching task submission:', error);
    return null;
  }
}

// Example 11: Update submission status (admin only)
export async function updateSubmissionStatusExample() {
  try {
    const { TasksService } = await import('./tasksService');

    const taskId = 'task-uuid-here'; // Replace with actual task ID
    const userId = 'user-uuid-here'; // Replace with actual user ID
    const status = 'APPROVED'; // APPROVED, REVISED, etc.
    const feedback = 'Great work! Well done.'; // Optional

    const result = await TasksService.updateSubmissionStatus(taskId, userId, status, feedback);
    console.log('Submission status updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating submission status:', error);
    return null;
  }
}

// Example 12: Complete workflow - Get submission then update status
export async function reviewSubmissionWorkflow() {
  try {
    const { TasksService } = await import('./tasksService');

    const taskId = 'task-uuid-here';
    const userId = 'user-uuid-here';

    // First, get the current submission
    console.log('Fetching submission...');
    const submission = await TasksService.getTaskSubmissionByTaskId(taskId);
    console.log('Current submission:', submission);

    // Then update the status
    console.log('Updating status...');
    const updateResult = await TasksService.updateSubmissionStatus(
      taskId,
      userId,
      'APPROVED',
      'Excellent submission! Approved.'
    );
    console.log('Status update result:', updateResult);

    return { submission, updateResult };
  } catch (error) {
    console.error('Error in review workflow:', error);
    return null;
  }
}