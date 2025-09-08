import { apiFetcher } from './fetcher';

export async function fetchMembers(): Promise<any[]> {
  return apiFetcher('/api/users');
}
