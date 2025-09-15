import { apiFetcher } from "./fetcher";
import { formatYearForAPI } from "@/hooks/useDivisions";

export type TaskStatus = "submitted" | "revision" | "approved";

export interface Task {
  id: string | number;
  title: string;
  description?: string;
  division?: string; // normalized slug (e.g., devops, frontend)
  rawDivision?: string; // original division text/id
  deadline?: string; // ISO or displayable string
  status?: TaskStatus; // status for current user if available
  unread?: boolean;
  // keep raw for debugging/future mapping
  raw?: any;
}

function extractYearNumber(year: string | number): number {
  if (typeof year === "number") return year;
  const m = year.match(/(\d{4})/);
  return m ? parseInt(m[1], 10) : new Date().getFullYear();
}

function normalizeDivision(
  value: string | number | undefined | null
): string | undefined {
  if (value == null) return undefined;
  const s = String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/designer|dev|developer/g, "");
  return s || undefined;
}

function mapStatus(value: any): TaskStatus | undefined {
  if (!value) return undefined;
  const s = String(value).toLowerCase();
  if (s.includes("approve")) return "approved";
  if (s.includes("revisi") || s.includes("revision") || s.includes("review"))
    return "revision";
  if (s.includes("submit")) return "submitted";
  return undefined;
}

function pickDeadline(obj: any): string | undefined {
  const candidates = [
    "deadline",
    "dueDate",
    "due_date",
    "end_at",
    "dueAt",
    "due_at",
  ];
  for (const key of candidates) {
    if (obj?.[key]) return String(obj[key]);
  }
  return undefined;
}

function pickTitle(obj: any): string {
  const candidates = ["title", "name", "taskTitle", "judul"];
  for (const key of candidates) {
    if (obj?.[key]) return String(obj[key]);
  }
  // fallback
  return "Task";
}

function pickDivisionRaw(obj: any): string | undefined {
  const candidates = [
    "division",
    "division_id",
    "divisionId",
    "divisionName",
    "division_name",
    "divisi",
  ];
  for (const key of candidates) {
    if (obj?.[key]) return String(obj[key]);
  }
  return undefined;
}

function pickUnread(obj: any): boolean | undefined {
  const candidates = ["unread", "is_new", "isNew", "has_update", "hasUpdate"];
  for (const key of candidates) {
    if (typeof obj?.[key] !== "undefined") return Boolean(obj[key]);
  }
  return undefined;
}

function pickId(obj: any): string | number {
  const candidates = ["id", "taskId", "_id"];
  for (const key of candidates) {
    if (typeof obj?.[key] !== "undefined") return obj[key];
  }
  return Math.random().toString(36).slice(2);
}

export class TasksService {
  static async getInfo(): Promise<any> {
    return apiFetcher<any>(`/api/tasks/info`);
  }

  static async createTask(payload: any): Promise<any> {
    return apiFetcher<any>(`/api/tasks`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async submitTask(taskId: string | number, payload: any): Promise<any> {
    return apiFetcher<any>(`/api/tasks/${taskId}/submit`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async updateUserTaskStatus(
    taskId: string | number,
    userId: string | number,
    status: "submitted" | "revision" | "approved" | string
  ): Promise<any> {
    return apiFetcher<any>(`/api/tasks/${taskId}/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  static async getTasksByYear(year: string | number): Promise<Task[]> {
    const y = extractYearNumber(formatYearForAPI(year));
    const data = await apiFetcher<any>(`/api/tasks/year/${y}`);

    const items: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.tasks)
      ? data.tasks
      : [];

    return items.map((raw) => {
      const rawDivision = pickDivisionRaw(raw);
      const division = normalizeDivision(rawDivision);
      const status = mapStatus(raw.status || raw.userStatus || raw.status_user);
      return {
        id: pickId(raw),
        title: pickTitle(raw),
        description: raw.description,
        division,
        rawDivision,
        deadline: pickDeadline(raw),
        status,
        unread: pickUnread(raw),
        raw,
      } as Task;
    });
  }

  static async getTasksByDivisionAndYear(
    divisionId: string,
    year: string | number
  ): Promise<Task[]> {
    const all = await this.getTasksByYear(year);
    const target = normalizeDivision(divisionId);
    if (!target) return all;
    return all.filter((t) => !t.division || t.division === target);
  }

  static async getTasksByUser(userId: string | number): Promise<Task[]> {
    const data = await apiFetcher<any>(`/api/tasks/users/${userId}`);
    const items: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.tasks)
      ? data.tasks
      : [];

    return items.map((raw) => {
      const rawDivision = pickDivisionRaw(raw);
      const division = normalizeDivision(rawDivision);
      const status = mapStatus(raw.status || raw.userStatus || raw.status_user);
      return {
        id: pickId(raw),
        title: pickTitle(raw),
        description: raw.description,
        division,
        rawDivision,
        deadline: pickDeadline(raw),
        status,
        unread: pickUnread(raw),
        raw,
      } as Task;
    });
  }
}
