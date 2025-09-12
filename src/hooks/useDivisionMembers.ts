import { useEffect, useMemo, useState } from "react";
import { DivisionService } from "@/services/division";
import { formatYearForAPI } from "@/hooks/useDivisions";

export interface DivisionMemberVM {
  id: string | number;
  username: string;
  division: string;
  school: string;
  avatarSrc?: string;
}

export function useDivisionMembers(divisionId: string, yearParam?: string) {
  const [members, setMembers] = useState<DivisionMemberVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiYear = useMemo(
    () => formatYearForAPI(yearParam || new Date().getFullYear()),
    [yearParam]
  );

  useEffect(() => {
    let active = true;
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const data = await DivisionService.getDivisionMembers(
          divisionId,
          apiYear
        );
        if (!active) return;
        setMembers(
          data.map((m) => ({
            id: m.id,
            username: m.username || m.full_name || "User",
            division: m.division,
            school: m.school,
            avatarSrc: m.avatarSrc,
          }))
        );
      } catch (e: any) {
        if (!active) return;
        setError(e?.message || "Failed to load members");
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchData();
    return () => {
      active = false;
    };
  }, [divisionId, apiYear]);

  return { members, loading, error };
}
