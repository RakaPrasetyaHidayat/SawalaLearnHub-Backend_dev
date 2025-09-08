import { useEffect, useState } from 'react';
import { apiFetcher } from '@/services/fetcher';

type Member = {
  id: string;
  name: string;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await apiFetcher('/api/users');
        setMembers(data as Member[]);
      } catch (err) {
        setError('Failed to fetch members. Please try again later.');
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="members-page">
      <h1>Members</h1>
      {error && <p className="error">{error}</p>}
      <ul>
        {members.map((member) => (
          <li key={member.id}>{member.name}</li>
        ))}
      </ul>
    </div>
  );
}
