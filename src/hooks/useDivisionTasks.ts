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
        // Try loading tasks; if first attempt fails due to transient network issue,
        // TasksService already retries internally, but do one additional attempt here
        let data: Task[];
        try {
          data = await TasksService.getTasksByDivisionAndYear(divisionId, apiYear);
        } catch (err) {
          console.warn("First attempt to load tasks failed, retrying once", err);
          await new Promise((r) => setTimeout(r, 700));
          data = await TasksService.getTasksByDivisionAndYear(divisionId, apiYear);
        }
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
        // Provide a friendly message and include original error for debugging
        const msg = e?.message || "Failed to load tasks";
        setError(msg.includes("timeout")
          ? "Failed to load tasks: request timed out. The API server may be unavailable. Showing cached data if available."
          : `Failed to load tasks: ${msg}`);
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
