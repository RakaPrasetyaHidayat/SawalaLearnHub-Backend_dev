import { useEffect, useMemo, useState } from "react";
import { formatYearForAPI } from "@/hooks/useDivisions";
import { Task, TasksService } from "@/services/tasksService";

export interface DivisionTaskVM {
  id: string | number;
  title: string;
  deadline: string;
  status: "submitted" | "revision" | "approved";
  unread?: boolean;
}

export function useDivisionTasks(divisionId: string, yearParam?: string) {
  const [tasks, setTasks] = useState<DivisionTaskVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiYear = useMemo(
    () => formatYearForAPI(yearParam || new Date().getFullYear()),
    [yearParam]
  );

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data: Task[] = await TasksService.getTasksByDivisionAndYear(
          divisionId,
          apiYear
        );
        if (!active) return;
        setTasks(
          data.map((t) => ({
            id: t.id,
            title: t.title,
            deadline: t.deadline || "-",
            status: t.status || "submitted",
            unread: t.unread,
          }))
        );
      } catch (e: any) {
        if (!active) return;
        setError(e?.message || "Failed to load tasks");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [divisionId, apiYear]);

  return { tasks, loading, error };
}
