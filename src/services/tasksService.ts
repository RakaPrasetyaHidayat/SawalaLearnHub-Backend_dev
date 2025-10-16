
import { apiFetcher } from "./fetcher";
import { formatYearForAPI } from "@/hooks/useDivisions";
import { mockTasks } from "./mockDataFallback";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://learnhubbackenddev.vercel.app";

export type TaskStatus = "submitted" | "revision" | "approved";

export interface Task {
  id: string | number;
  title: string;
  description?: string;
  division?: string; // normalized slug (e.g., devops, frontend, uiux)
  rawDivision?: string; // original division text/id (could be UUID)
  deadline?: string; // ISO or displayable string
  status?: TaskStatus; // status for current user if available
  unread?: boolean;
  raw?: any;
}

function extractYearNumber(year: string | number): number {
  if (typeof year === "number") return year;
  const m = String(year).match(/(\d{4})/);
  return m ? parseInt(m[1], 10) : new Date().getFullYear();
}

function normalizeDivision(value: string | number | undefined | null): string | undefined {
  if (value == null) return undefined;
  const s = String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/designer|dev|developer/g, "");
  return s || undefined;
}

function mapDivisionSlug(rawDivision: string | undefined): string | undefined {
  if (!rawDivision) return undefined;
  const raw = String(rawDivision).trim();
  const normalized = normalizeDivision(raw);
  if (!normalized) return undefined;
  if (normalized === "uiux" || normalized.includes("uiux") || normalized.includes("ui-ux")) return "uiux";
  if (normalized.includes("frontend") || normalized.includes("fe") || normalized.includes("front")) return "frontend";
  if (normalized.includes("backend") || normalized.includes("be") || normalized.includes("back")) return "backend";
  if (normalized.includes("devops")) return "devops";
  return normalized;
}

function mapStatus(value: any): TaskStatus | undefined {
  if (!value) return undefined;
  const s = String(value).toLowerCase();
  if (s.includes("approve")) return "approved";
  if (s.includes("revisi") || s.includes("revision") || s.includes("review")) return "revision";
  if (s.includes("submit")) return "submitted";
  return undefined;
}

function pickDeadline(obj: any): string | undefined {
  const candidates = ["deadline", "dueDate", "due_date", "end_at", "dueAt", "due_at"];
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
  return "Task";
}

function pickDivisionRaw(obj: any): string | undefined {
  if (!obj) return undefined;
  return obj.division ?? obj.rawDivision ?? obj.division_id ?? obj.divisionId ?? obj.channel ?? obj.channel_id ?? undefined;
}

function pickId(obj: any): string | number {
  return obj?.id ?? obj?._id ?? obj?.taskId ?? obj?.identifier ?? Math.random().toString(36).slice(2);
}

function pickUnread(obj: any): boolean {
  if (obj == null) return false;
  return Boolean(obj.unread || obj.is_unread || obj._unread);
}

export class TasksService {
  // Simple createTask: always POST JSON to /api/tasks (apiFetcher will use NEXT_PUBLIC_API_URL)
  static async createTask(payload: any): Promise<any> {
    const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
    const options: RequestInit = { method: "POST" };
    if (isFormData) {
      options.body = payload as any; // Let browser set multipart boundary
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(payload ?? {});
    }
    return apiFetcher(`/api/tasks`, options);
  }

  static async submitTask(taskId: string | number, payload: any): Promise<any> {
    try {
      // Validate inputs
      if (!taskId) {
        throw new Error("Task ID is required");
      }
      
      if (!payload || ((!payload.files || payload.files.length === 0) && !payload.description?.trim())) {
        throw new Error("Please provide either files or description");
      }
      
      // Check if payload contains files
      const hasFiles = payload.files && payload.files.length > 0;
      
      if (hasFiles) {
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append("description", payload.description || "");
        
        // Append each file - use 'file' as the field name to match common API expectations
        payload.files.forEach((file: File, index: number) => {
          formData.append("file", file);
        });
        
        return await apiFetcher(`/api/tasks/${taskId}/submit`, {
          method: "POST",
          body: formData, // Let browser set Content-Type with boundary
        });
      } else {
        // Use JSON for text-only submissions
        return await apiFetcher(`/api/tasks/${taskId}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: payload.description || ""
          }),
        });
      }
    } catch (error: any) {
      console.error("TasksService.submitTask error:", error);
      
      // Provide user-friendly error messages
      if (error?.status === 401) {
        throw new Error("Please login again to submit your task");
      } else if (error?.status === 403) {
        throw new Error("You don't have permission to submit this task");
      } else if (error?.status === 404) {
        throw new Error("Task not found. Please check if the task still exists");
      } else if (error?.status === 413) {
        throw new Error("File size too large. Please reduce file size and try again");
      } else if (error?.status >= 500) {
        throw new Error("Server error. Please try again later");
      } else if (error?.message?.includes("timeout")) {
        throw new Error("Request timeout. Please check your connection and try again");
      } else if (error?.message) {
        throw error; // Re-throw with original message
      } else {
        throw new Error("Failed to submit task. Please try again");
      }
    }
  }

  static async updateUserTaskStatus(
    taskId: string | number,
    userId: string | number,
    status: "submitted" | "revision" | "approved" | string
  ): Promise<any> {
    try {
  const result = await apiFetcher(`/api/tasks/${taskId}/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return result;
    } catch (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  }

  static async getTasksByYear(year: string | number): Promise<Task[]> {
    const y = extractYearNumber(formatYearForAPI(year));

    // Try year-specific endpoint, fallback to /api/tasks, then to mock data
    try {
      let data: any;
      try {
  data = await apiFetcher(`/api/tasks/year?year=${y}`);
      } catch (err) {
  data = await apiFetcher(`/api/tasks`);
      }

      const items: any[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.tasks)
        ? data.tasks
        : [];

      const filtered = items.filter((raw: any) => {
        const cy = raw?.channel_year ?? raw?.year ?? raw?.angkatan;
        const num = Number.parseInt(String(cy), 10);
        return Number.isFinite(num) ? num === y : true;
      });

      return filtered.map((raw) => {
        const rawDivision = pickDivisionRaw(raw);
        const division = mapDivisionSlug(rawDivision);
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
    } catch (err) {
      console.warn("Tasks API failed, falling back to mock data:", err);
      const items = Array.isArray(mockTasks) ? mockTasks : [];
      return items.map((raw: any) => ({
        id: raw.id ?? Math.random().toString(36).slice(2),
        title: raw.title ?? raw.name ?? "Task",
        description: raw.description,
        division: undefined,
        rawDivision: undefined,
        deadline: raw.deadline ?? raw.dueDate ?? raw.due_date,
        status: (raw.status || raw.state || "submitted") as TaskStatus,
        unread: Boolean(raw.unread),
        raw,
      } as Task));
    }
  }

  static async getTasksByDivisionAndYear(divisionId: string, year: string | number): Promise<Task[]> {
    const all = await this.getTasksByYear(year);
    const target = normalizeDivision(divisionId);
    if (!target || target === "all") return all;
    return all.filter((t) => !t.division || t.division === target);
  }

  static async getTasksByUser(userId: string | number): Promise<Task[]> {
  const data = await apiFetcher(`/api/tasks/users/${userId}`);
    const items: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.tasks)
      ? data.tasks
      : [];

    return items.map((raw) => {
      const rawDivision = pickDivisionRaw(raw);
      const division = mapDivisionSlug(rawDivision);
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

  // Fetch tasks for current authenticated user using backend '/api/tasks/me' if available
  static async getMyTasks(): Promise<Task[]> {
    try {
      // Try absolute backend /api/tasks/me first
      const url = `${API_BASE}/api/tasks/me`;
      const data = await apiFetcher(url);

      const items: any[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.tasks)
        ? data.tasks
        : [];

      return items.map((raw) => {
        const rawDivision = pickDivisionRaw(raw);
        const division = mapDivisionSlug(rawDivision);
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
    } catch (err) {
      console.warn("getMyTasks: /api/tasks/me failed, falling back to getTasksByUser or getTasksByYear:", err);
      // As a fallback, try to find a userId from auth token or return empty — but we don't have userId here.
      // Fallback: return empty array to avoid breaking UI.
      return [];
    }
  }

  static async getTaskById(taskId: string | number): Promise<any> {
    const response = await apiFetcher(`/api/tasks/${taskId}`);
    // Handle the API response structure where actual data is nested under 'data' property
    const data = response?.data || response;
    return {
      id: pickId(data),
      title: pickTitle(data),
      description: data.description || "",
      division: mapDivisionSlug(pickDivisionRaw(data)),
      rawDivision: pickDivisionRaw(data),
      deadline: pickDeadline(data),
      channel_year: data.channel_year || data.year,
    };
  }

  static async getTaskSubmissionById(submissionId: string | number): Promise<any> {
    try {
      const response = await apiFetcher(`/api/tasks/submissions/${submissionId}`);
      return response?.data || response;
    } catch (error) {
      console.error("Error fetching task submission:", error);
      throw error;
    }
  }

  // Get task submission for current user by taskId (showing description + file_urls)
  static async getTaskSubmissionByTaskId(taskId: string | number): Promise<any> {
    try {
      const response = await apiFetcher(`/api/tasks/${taskId}/submission`);

      if (response?.status === "success" && response.data) {
        return response.data; // Contains id, task_id, user_id, description, file_urls, etc.
      }

      throw new Error("Submission not found or invalid response");
    } catch (error: any) {
      console.error("Error fetching task submission by taskId:", error);

      // Handle 404 specifically for no submission found
      if (error?.status === 404) {
        throw new Error("No submission found for this task");
      }

      throw error;
    }
  }

  // Update submission status (admin only)
  static async updateSubmissionStatus(
    taskId: string | number,
    userId: string | number,
    status: string,
    feedback?: string
  ): Promise<any> {
    try {
      const body: any = { status };
      if (feedback) {
        body.feedback = feedback;
      }

      const response = await apiFetcher(`/api/tasks/${taskId}/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response?.status === "success") {
        return response;
      }

      throw new Error("Failed to update submission status");
    } catch (error: any) {
      console.error("Error updating submission status:", error);

      // Provide user-friendly error messages
      if (error?.status === 401) {
        throw new Error("Authentication required. Please login as admin.");
      } else if (error?.status === 403) {
        throw new Error("Admin access required to update submission status.");
      } else if (error?.status === 404) {
        throw new Error("Submission not found.");
      } else if (error?.message) {
        throw error;
      } else {
        throw new Error("Failed to update submission status. Please try again.");
      }
    }
  }
}
