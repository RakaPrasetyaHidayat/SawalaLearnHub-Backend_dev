import { ApiErrorHandler } from "@/utils/api-error-handler";
import { apiFetcher, getAuthToken } from "./fetcher";

// Division API Service
export interface Division {
  id: string;
  name: string;
  logo: string;
  logoAlt: string;
  memberCount: number;
}

export interface DivisionMember {
  id: string;
  name: string;
  email: string;
  division: string;
  year: string;
  status: "approved" | "pending" | "rejected";
}

export class DivisionService {
  private static baseUrl = "/api";
  private static isDevelopment = process.env.NODE_ENV === "development";
  private static useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

  /**
   * Get all divisions with member count for a specific year
   */
  static async getDivisionsWithMemberCount(
    year: string,
    status: string = "approved"
  ): Promise<Division[]> {
    try {
      // Get all divisions first (you might need to create this endpoint)
      const divisions = await this.getAllDivisions();

      // Get member count for each division
      const divisionsWithCount = await Promise.all(
        divisions.map(async (division) => {
          try {
            const memberCount = await this.getDivisionMemberCount(
              division.id,
              year,
              status
            );
            return {
              ...division,
              memberCount,
            };
          } catch (e) {
            console.warn(
              `Failed to fetch member count for division ${division.id}. Defaulting to 0.`,
              e
            );
            return {
              ...division,
              memberCount: 0,
            };
          }
        })
      );

      return divisionsWithCount;
    } catch (error) {
      const apiError = ApiErrorHandler.handleError(error);
      console.error("Error fetching divisions with member count:", apiError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Get real member count from database API using proper authentication
   * Enhanced: try server-side filtering with query params (year, status, division) first,
   * then fallback to client-side filtering if needed.
   */
  private static async getRealMemberCount(
    divisionId: string,
    year: string,
    status: string = "approved"
  ): Promise<number> {
    try {
      // Extract year or allow 'all' to disable year filter
      const yearArg = String(year || "").trim();
      const anyYear = /^all$/i.test(yearArg);
      let yearNumber: number | null = null;
      if (!anyYear) {
        const formattedMatch = yearArg.match(/intern-of-sawala-(\d{4})/);
        if (formattedMatch) {
          yearNumber = parseInt(formattedMatch[1], 10);
        } else if (/^\d{4}$/.test(yearArg)) {
          yearNumber = parseInt(yearArg, 10);
        } else {
          const anyMatch = yearArg.match(/(\d{4})/);
          yearNumber = anyMatch
            ? parseInt(anyMatch[1], 10)
            : new Date().getFullYear();
        }
      }

      // Default status filter (can be adjusted later to be configurable)
      const preferredStatus = status || "approved";

      console.log(
        `Fetching real data for division ${divisionId}, year ${
          anyYear ? "all" : yearNumber
        }`
      );

      // Helper to safely extract count from various response shapes
      const extractCount = (resp: any): number | undefined => {
        if (!resp) return undefined;
        const count = resp?.data?.count ?? resp?.count;
        if (typeof count === "number") return count;
        // If API returns array without count
        if (Array.isArray(resp?.data?.users)) return resp.data.users.length;
        if (Array.isArray(resp?.users)) return resp.users.length;
        if (Array.isArray(resp?.data)) return resp.data.length;
        if (Array.isArray(resp)) return resp.length;
        return undefined;
      };

      // 1) Try server-side filtered count via division endpoint (with year & status)
      // Build candidate identifiers (names + UUID from ENV). ENV may contain full URLs; extract UUID safely.
      const candidatesMap: Record<string, string[]> = {
        uiux: ["uiux", "UI/UX", "UI/UX Designer", "ui-ux", "uiux-designer"],
        frontend: ["frontend", "Frontend", "Frontend Dev", "frontend-dev"],
        backend: ["backend", "Backend", "Backend Dev", "backend-dev"],
        devops: ["devops", "DevOps"],
      };
      const divisionEnvRawMap: Record<string, string | undefined> = {
        uiux: process.env.NEXT_PUBLIC_DIVISION_UIUX_ID,
        frontend: process.env.NEXT_PUBLIC_DIVISION_FRONTEND_ID,
        backend: process.env.NEXT_PUBLIC_DIVISION_BACKEND_ID,
        devops: process.env.NEXT_PUBLIC_DIVISION_DEVOPS_ID,
      };
      const extractUuid = (val?: string): string | undefined => {
        if (!val) return undefined;
        const m = String(val).match(
          /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i
        );
        return m ? m[0] : undefined;
      };
      const envUuid = extractUuid(divisionEnvRawMap[divisionId]);
      const candidates =
        divisionId === "all"
          ? ["all"]
          : [
              ...(candidatesMap[divisionId] || [divisionId]),
              ...(envUuid ? [envUuid] : []),
            ];

      let data: any | undefined;

      // For 'all' division, fetch all users and filter client-side
      if (divisionId === "all") {
        try {
          const url = `/api/users/all`;
          const resp = await apiFetcher<any>(url);
          const cnt = extractCount(resp);
          if (typeof cnt === "number") {
            // We cannot trust server count for year filtering; fallback to client-side filtering below
            // So pass through to client-side by attaching resp to data
          }
          // Use this response as data for client-side filtering
          data = resp;
          // Continue to client-side filtering below using the fallback path
        } catch (_) {
          /* continue to fallback */
        }
      } else {
        // Try each candidate on the division endpoint first, but ONLY for UUID candidates
        const uuidRe =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const uuidCandidates = candidates.filter((c) => uuidRe.test(c));
        for (const cand of uuidCandidates) {
          try {
            const url = `/api/users/division/${encodeURIComponent(cand)}`;
            const resp = await apiFetcher<any>(url);
            const cnt = extractCount(resp);
            if (typeof cnt === "number") return cnt;
          } catch (_) {
            // Try next candidate
          }
        }

        // If division endpoint did not return count, try fetching all users (admin) and filter client-side
        try {
          const url = `/api/users/all`;
          const resp = await apiFetcher<any>(url);
          data = resp; // use this for client-side filtering below
        } catch (_) {
          // As a last resort, try paginated users without unsupported params
          try {
            const url = `/api/users?limit=1000&status=${encodeURIComponent(
              preferredStatus
            )}`;
            const resp = await apiFetcher<any>(url);
            data = resp;
          } catch (_) {
            // give up to client-side generic fetch
          }
        }
      }

      // 2) Fallback: fetch users and filter client-side (legacy logic)
      if (!data) {
        const endpoint = "/api/users";
        try {
          data = await apiFetcher<any>(endpoint);
        } catch (e) {
          console.warn(`Fallback fetch ${endpoint} failed, proceeding with empty users array.`, e);
          // ensure we don't propagate API errors upstream; present empty data to filtering logic
          data = [];
        }
      }

      // Extract user arrays from various possible shapes
      const tryExtractArray = (obj: any): any[] | null => {
        if (!obj || typeof obj !== "object") return null;
        if (Array.isArray(obj)) return obj;
        if (Array.isArray(obj.data)) return obj.data;
        if (Array.isArray(obj.users)) return obj.users;
        if (Array.isArray(obj?.data?.data)) return obj.data.data;
        if (Array.isArray(obj?.data?.users)) return obj.data.users;
        if (Array.isArray(obj.payload)) return obj.payload;
        if (Array.isArray(obj.result)) return obj.result;
        const firstArray = Object.values(obj).find((v) => Array.isArray(v)) as
          | any[]
          | undefined;
        return firstArray || null;
      };

      const users = tryExtractArray(data) || [];

      // Normalize division strings conservatively. Do NOT strip "dev" to preserve "devops".
      const normalize = (s: string) =>
        String(s)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .replace(/designer|developer/g, "");
      const divIdNorm = normalize(divisionId);

      const allowedStatuses = new Set([
        "approved",
        "active",
        "accepted",
        "verified",
      ]);

      const targetStatus = (preferredStatus || "").toString().toLowerCase();
      const matchAnyStatus = targetStatus === "all" || targetStatus === "";

      const filteredUsers = users.filter((user: any) => {
        const userYearRaw =
          user.angkatan ??
          user.channel_year ??
          user.year ??
          user.tahun ??
          user.batch;
        const userYearNum = Number.parseInt(String(userYearRaw), 10);

        // Build candidate division strings from multiple fields (support nested and alt keys)
        const nameCandidatesRaw = [
          user.division,
          user.division_name,
          user.divisionName,
          user.role,
          user.role_name,
          user.department,
          user.team,
          user.divisionTitle,
          user.divisi,
          user.bidang,
          user.section,
          user.position,
          user?.division?.name,
          user?.division?.title,
          user?.division?.slug,
        ];
        const idCandidatesRaw = [
          user.division_id,
          user.divisionId,
          user.division_uuid,
          user.divisionUuid,
          user?.division?.id,
          user?.division?.uuid,
          user?.division?.division_id,
        ];
        const divisionNameCandidates = nameCandidatesRaw
          .filter(Boolean)
          .map((v: any) => normalize(v));
        const rawUuidCandidates = idCandidatesRaw
          .filter(Boolean)
          .map((v: any) => String(v).toLowerCase());

        // Prefer exact UUID match when available (division_id in DB vs env UUID)
        const uuidMatch =
          !!envUuid && rawUuidCandidates.includes(envUuid.toLowerCase());

        const divisionMatch =
          divisionId === "all" ||
          uuidMatch ||
          divisionNameCandidates.some(
            (cand: string) =>
              cand === divIdNorm ||
              cand.includes(divIdNorm) ||
              divIdNorm.includes(cand)
          );

        // Status matching: either any status, or exact match if provided
        const rawStatus = (user.status ?? "").toString().toLowerCase();
        const normalizedStatus = allowedStatuses.has(rawStatus)
          ? rawStatus
          : rawStatus; // keep as is if unknown
        const statusOk = matchAnyStatus || normalizedStatus === targetStatus;

        return (
          (anyYear || userYearNum === yearNumber) && divisionMatch && statusOk
        );
      });

      console.log(
        `Filtered (fallback) users for division ${divisionId}, year ${yearNumber}:`,
        {
          totalUsers: users.length,
          filteredCount: filteredUsers.length,
          targetYear: yearNumber,
          hasToken: !!getAuthToken(),
          sampleUser: users[0],
        }
      );

      return filteredUsers.length;
    } catch (error) {
      console.error(
        `Error fetching real member count for division ${divisionId}:`,
        error
      );

      if (
        error instanceof Error &&
        error.message.includes("Authentication required")
      ) {
        console.warn("API requires authentication. User needs to log in.");
      }

      return 0;
    }
  }

  /**
   * Get member count for a specific division and year
   */
  static async getDivisionMemberCount(
    divisionId: string,
    year: string,
    status: string = "approved"
  ): Promise<number> {
    console.log(
      `Fetching member count for division ${divisionId}, year ${year}`
    );

    try {
      // Use the new real data method with status filter
      const count = await this.getRealMemberCount(divisionId, year, status);
      console.log(
        `Successfully fetched real data for division ${divisionId}: ${count} members`
      );
      return count;
    } catch (error) {
      console.error(
        `Error fetching real member count for division ${divisionId}:`,
        error
      );

      // Handle authentication errors specifically
      if (
        error instanceof Error &&
        error.message.includes("Authentication required")
      ) {
        console.warn(
          `Authentication required for division ${divisionId}. Please ensure user is logged in.`
        );
        // For now, return 0 but in a real app you might want to:
        // - Show a login modal
        // - Redirect to login page
        // - Show an authentication prompt
        return 0;
      }

      // Only use mock data as absolute fallback if explicitly enabled
      if (this.useMockData) {
        console.log(`Falling back to mock data for division ${divisionId}`);
        // Fallback mock data (minimal)
        const fallbackData: Record<string, Record<string, number>> = {
          "intern-of-sawala-2025": {
            all: 0,
            uiux: 0,
            frontend: 0,
            backend: 0,
            devops: 0,
          },
          "intern-of-sawala-2024": {
            all: 0,
            uiux: 0,
            frontend: 0,
            backend: 0,
            devops: 0,
          },
          "intern-of-sawala-2023": {
            all: 0,
            uiux: 0,
            frontend: 0,
            backend: 0,
            devops: 0,
          },
        };
        const yearData =
          fallbackData[year] || fallbackData["intern-of-sawala-2025"];
        return yearData[divisionId] || 0;
      }

      return 0; // Return 0 if there's an error and no mock data
    }
  }

  /**
   * Get all divisions (static data for now, but can be made dynamic)
   */
  static async getAllDivisions(): Promise<Omit<Division, "memberCount">[]> {
    // This could be fetched from API in the future
    return [
      {
        id: "all",
        name: "All Division",
        logo: "/assets/logos/logo1.png",
        logoAlt: "All Division Logo",
      },
      {
        id: "uiux",
        name: "UI/UX Designer",
        logo: "/assets/logos/logo-purple.png",
        logoAlt: "UI/UX Designer Logo",
      },
      {
        id: "frontend",
        name: "Frontend Dev",
        logo: "/assets/logos/logo-green.png",
        logoAlt: "Frontend Developer Logo",
      },
      {
        id: "backend",
        name: "Backend Dev",
        logo: "/assets/logos/logo-yellow.png",
        logoAlt: "Backend Developer Logo",
      },
      {
        id: "devops",
        name: "DevOps",
        logo: "/assets/logos/logo-black.png",
        logoAlt: "DevOps Logo",
      },
    ];
  }

  /**
   * Get total member count across all divisions for a specific year
   */
  static async getTotalMemberCount(
    year: string,
    status: string = "approved"
  ): Promise<number> {
    try {
      // Use the same real-data path with divisionId = 'all' so we count exactly what the UI will filter
      const total = await this.getRealMemberCount("all", year, status);
      return total;
    } catch (error) {
      const apiError = ApiErrorHandler.handleError(error);
      console.error("Error fetching total member count:", apiError);
      return 0;
    }
  }

  /**
   * Get list of members for a specific division and year
   */
  static async getDivisionMembers(
    divisionId: string,
    year: string
  ): Promise<
    Array<{
      id: string | number;
      username: string;
      full_name?: string;
      division: string;
      angkatan?: number;
      school: string;
      avatarSrc?: string;
      email?: string;
    }>
  > {
    try {
      // Extract year, allow 'all' to disable year filter
      const yearArg = String(year || "").trim();
      const anyYear = /^all$/i.test(yearArg);
      let yearNumber: number | null = null;
      if (!anyYear) {
        const yearMatch = yearArg.match(/intern-of-sawala-(\d{4})/);
        yearNumber = yearMatch
          ? parseInt(yearMatch[1], 10)
          : /^\d{4}$/.test(yearArg)
          ? parseInt(yearArg, 10)
          : (() => {
              const m = yearArg.match(/(\d{4})/);
              return m ? parseInt(m[1], 10) : new Date().getFullYear();
            })();
      }

      let endpoint: string = "";
      let data: any;

      if (divisionId === "all") {
        // Prefer full users listing first, then fallback to paginated endpoint
        try {
          endpoint = "/api/users/all";
          data = await apiFetcher<any>(endpoint);
        } catch (e) {
          try {
            endpoint = "/api/users?limit=1000";
            data = await apiFetcher<any>(endpoint);
          } catch (_) {
            endpoint = "/api/users";
            data = await apiFetcher<any>(endpoint);
          }
        }
      } else {
        const candidatesMap: Record<string, string[]> = {
          uiux: ["uiux", "UI/UX", "UI/UX Designer", "ui-ux", "uiux-designer"],
          frontend: ["frontend", "Frontend", "Frontend Dev", "frontend-dev"],
          backend: ["backend", "Backend", "Backend Dev", "backend-dev"],
          devops: ["0e5c4601-d68a-45d0-961f-b11e0472a71b", "devops", "DevOps"],
        };
        const divisionUuidMap: Record<string, string | undefined> = {
          uiux: process.env.NEXT_PUBLIC_DIVISION_UIUX_ID,
          frontend: process.env.NEXT_PUBLIC_DIVISION_FRONTEND_ID,
          backend: process.env.NEXT_PUBLIC_DIVISION_BACKEND_ID,
          devops: process.env.NEXT_PUBLIC_DIVISION_DEVOPS_ID,
        };
        const envUuid = divisionUuidMap[divisionId];
        const candidates = [
          ...(candidatesMap[divisionId] || [divisionId]),
          ...(envUuid ? [envUuid] : []),
        ];

        // Only call division endpoint when candidate is a UUID. Otherwise, backend returns 400.
        const uuidRe =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const uuidCandidates = candidates.filter((c) => uuidRe.test(c));

        let lastResp: any = null;
        if (uuidCandidates.length > 0) {
          for (const cand of uuidCandidates) {
            endpoint = `/api/users/division/${encodeURIComponent(cand)}`;
            let resp: any = null;
            try {
              resp = await apiFetcher<any>(endpoint);
            } catch (e) {
              // Ignore backend validation error and try next candidate
              continue;
            }

            const quickUsers = Array.isArray(resp)
              ? resp
              : Array.isArray(resp?.data)
              ? resp.data
              : Array.isArray(resp?.users)
              ? resp.users
              : [];

            lastResp = resp;
            if (quickUsers.length > 0) {
              data = resp;
              break;
            }
          }
        }

        // If no UUID candidates or no non-empty result, fetch all users and filter client-side
        if (typeof data === "undefined") {
          endpoint = "/api/users";
          try {
            data = await apiFetcher<any>(endpoint);
          } catch (e) {
            console.warn(`Fetching ${endpoint} failed while resolving division members for ${divisionId}:`, e);
            data = [];
          }
        }
      }

      let users: any[] = [];
      if (data?.success && Array.isArray(data.data)) {
        users = data.data;
      } else if (Array.isArray(data)) {
        users = data;
      } else if (Array.isArray(data?.users)) {
        users = data.users;
      } else if (Array.isArray(data?.data)) {
        users = data.data;
      }

      const normalize = (s: any) =>
        String(s)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .replace(/designer|dev|developer/g, "");

      const divIdNorm = normalize(divisionId);

      let filteredUsers = users.filter((user: any) => {
        const userYearRaw =
          user.angkatan ??
          user.channel_year ??
          user.year ??
          user.tahun ??
          user.batch;
        const userYearNum = Number.parseInt(String(userYearRaw), 10);

        // Accept missing/unknown status; allow common approved synonyms
        const rawStatus = (user.status ?? "").toString().toLowerCase();
        const statusOk =
          !rawStatus ||
          ["approved", "active", "accepted", "verified"].includes(rawStatus);

        if (divisionId === "all") {
          return (anyYear || userYearNum === yearNumber) && statusOk;
        }

        // Build candidate division strings (names and IDs)
        const nameCandidatesRaw = [
          user.division,
          user.division_name,
          user.divisionName,
          user.role,
          user.role_name,
          user.department,
          user.team,
          user?.division?.name,
        ];
        const idCandidatesRaw = [
          user.division_id,
          user.divisionId,
          user.division_uuid,
          user.divisionUuid,
          user?.division?.id,
          user?.division?.uuid,
        ];

        const divisionNameCandidates = nameCandidatesRaw
          .filter(Boolean)
          .map((v: any) => normalize(v));
        const rawUuidCandidates = idCandidatesRaw
          .filter(Boolean)
          .map((v: any) => String(v).toLowerCase());
        const uuidCandidatesNormalized = rawUuidCandidates.map((v) =>
          v.replace(/-/g, "")
        );

        // Prefer exact UUID match against env mapping
        const divisionUuidMap: Record<string, string | undefined> = {
          uiux: process.env.NEXT_PUBLIC_DIVISION_UIUX_ID,
          frontend: process.env.NEXT_PUBLIC_DIVISION_FRONTEND_ID,
          backend: process.env.NEXT_PUBLIC_DIVISION_BACKEND_ID,
          devops: process.env.NEXT_PUBLIC_DIVISION_DEVOPS_ID,
        };
        const envUuid = divisionUuidMap[divisionId];
        const uuidMatch =
          !!envUuid && rawUuidCandidates.includes(envUuid.toLowerCase());

        const divisionMatch =
          uuidMatch ||
          divisionId === "all" ||
          divisionNameCandidates.some(
            (cand: string) =>
              cand === divIdNorm ||
              cand.includes(divIdNorm) ||
              divIdNorm.includes(cand)
          ) ||
          // If divisionId itself is a UUID, compare normalized UUIDs
          uuidCandidatesNormalized.includes(divIdNorm);

        return userYearNum === yearNumber && divisionMatch && statusOk;
      });

      // Fallback: if no results for this year, show members by division regardless of year
      if (filteredUsers.length === 0 && divisionId !== "all") {
        filteredUsers = users.filter((user: any) => {
          const rawStatus = (user.status ?? "").toString().toLowerCase();
          const statusOk =
            !rawStatus ||
            ["approved", "active", "accepted", "verified"].includes(rawStatus);

          const nameCandidatesRaw = [
            user.division,
            user.division_name,
            user.divisionName,
            user.role,
            user.role_name,
            user.department,
            user.team,
            user?.division?.name,
          ];
          const idCandidatesRaw = [
            user.division_id,
            user.divisionId,
            user.division_uuid,
            user.divisionUuid,
            user?.division?.id,
            user?.division?.uuid,
          ];
          const divisionNameCandidates = nameCandidatesRaw
            .filter(Boolean)
            .map((v: any) => normalize(v));
          const rawUuidCandidates = idCandidatesRaw
            .filter(Boolean)
            .map((v: any) => String(v).toLowerCase());
          const uuidCandidatesNormalized = rawUuidCandidates.map((v) =>
            v.replace(/-/g, "")
          );

          const divisionUuidMap: Record<string, string | undefined> = {
            uiux: process.env.NEXT_PUBLIC_DIVISION_UIUX_ID,
            frontend: process.env.NEXT_PUBLIC_DIVISION_FRONTEND_ID,
            backend: process.env.NEXT_PUBLIC_DIVISION_BACKEND_ID,
            devops: process.env.NEXT_PUBLIC_DIVISION_DEVOPS_ID,
          };
          const envUuid = divisionUuidMap[divisionId];
          const uuidMatch =
            !!envUuid && rawUuidCandidates.includes(envUuid.toLowerCase());

          const divisionMatch =
            uuidMatch ||
            divisionId === "all" ||
            divisionNameCandidates.some(
              (cand: string) =>
                cand === divIdNorm ||
                cand.includes(divIdNorm) ||
                divIdNorm.includes(cand)
            ) ||
            uuidCandidatesNormalized.includes(divIdNorm);

          return divisionMatch && statusOk;
        });
      }

      // Map to UI-friendly shape
      const friendlyNameByUuid: Record<string, string> = {
        [(process.env.NEXT_PUBLIC_DIVISION_UIUX_ID || "").toLowerCase()]:
          "UI/UX Designer",
        [(process.env.NEXT_PUBLIC_DIVISION_FRONTEND_ID || "").toLowerCase()]:
          "Frontend Dev",
        [(process.env.NEXT_PUBLIC_DIVISION_BACKEND_ID || "").toLowerCase()]:
          "Backend Dev",
        [(process.env.NEXT_PUBLIC_DIVISION_DEVOPS_ID || "").toLowerCase()]:
          "DevOps",
        uiux: "UI/UX Designer",
        frontend: "Frontend Dev",
        backend: "Backend Dev",
        devops: "DevOps",
      };

      const normalizedMembers = filteredUsers.map((u: any) => {
        const rawDiv = u?.division_id ?? u?.division ?? "";
        const divKey = String(rawDiv).toLowerCase();
        const divisionLabel =
          friendlyNameByUuid[divKey] ||
          u?.division_name ||
          u?.division ||
          divisionId;
        return {
          id: u?.id ?? u?._id ?? "",
          email: u?.email ?? "",
          username:
            u?.username ??
            u?.full_name ??
            u?.name ??
            (typeof u?.email === "string" ? u.email.split("@")[0] : "User"),
          full_name: u?.full_name ?? u?.name,
          division: divisionLabel,
          angkatan: u?.angkatan ?? u?.channel_year,
          school: u?.school_name ?? u?.school ?? u?.sekolah ?? "",
          avatarSrc: u?.avatarSrc ?? u?.avatar ?? u?.image ?? undefined,
        };
      });

      return normalizedMembers;
    } catch (error) {
      const apiError = ApiErrorHandler.handleError(error);
      console.error("Error fetching division members:", apiError);
      return [];
    }
  }
}

/**
 * Helper: Get a user-friendly division display string from a user object.
 * Priority: division_name -> division.name -> division (string) -> division_id -> ''
 */
export function getDisplayDivision(user: any): string {
  if (!user) return "";
  // Prefer explicit division_name field
  if (user.division_name && String(user.division_name).trim())
    return String(user.division_name).trim();

  // If division is object with name
  if (user.division && typeof user.division === "object") {
    if (user.division.name && String(user.division.name).trim())
      return String(user.division.name).trim();
  }

  // If division is plain string but not a UUID, prefer it
  if (user.division && typeof user.division === "string") {
    const div = String(user.division).trim();
    // If it's a UUID, avoid showing raw UUID; return empty so callers can try other fields
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRe.test(div)) return div;
  }

  // Fallback to division_id or other fields
  if (user.division_id && String(user.division_id).trim())
    return String(user.division_id).trim();

  // If still not available, try other aliases
  if (user.divisi && String(user.divisi).trim()) return String(user.divisi).trim();
  if (user.bidang && String(user.bidang).trim()) return String(user.bidang).trim();

  return "";
}
