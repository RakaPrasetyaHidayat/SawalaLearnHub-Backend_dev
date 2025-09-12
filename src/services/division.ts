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
  static async getDivisionsWithMemberCount(year: string): Promise<Division[]> {
    try {
      // Get all divisions first (you might need to create this endpoint)
      const divisions = await this.getAllDivisions();

      // Get member count for each division
      const divisionsWithCount = await Promise.all(
        divisions.map(async (division) => {
          const memberCount = await this.getDivisionMemberCount(
            division.id,
            year
          );
          return {
            ...division,
            memberCount,
          };
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
   */
  private static async getRealMemberCount(
    divisionId: string,
    year: string
  ): Promise<number> {
    try {
      // Extract year number from formatted year string (e.g., "intern-of-sawala-2025" -> "2025")
      const yearMatch = year.match(/intern-of-sawala-(\d{4})/);
      const yearNumber = yearMatch
        ? parseInt(yearMatch[1])
        : new Date().getFullYear();

      console.log(
        `Fetching real data for division ${divisionId}, year ${yearNumber}`
      );

      let endpoint: string;
      let data: any;

      if (divisionId === "all") {
        // For "all" division, get all users and filter by year
        endpoint = "/api/users";
        console.log(`Fetching all users from: ${endpoint}`);
        data = await apiFetcher<any>(endpoint);
      } else {
        // For specific division, try multiple possible identifiers that the backend might accept
        const candidatesMap: Record<string, string[]> = {
          uiux: ["uiux", "UI/UX", "UI/UX Designer", "ui-ux", "uiux-designer"],
          frontend: ["frontend", "Frontend", "Frontend Dev", "frontend-dev"],
          backend: ["backend", "Backend", "Backend Dev", "backend-dev"],
          devops: ["devops", "DevOps"],
        };
        const candidates = candidatesMap[divisionId] || [divisionId];

        let lastResp: any = null;
        for (const cand of candidates) {
          endpoint = `/api/users/division/${encodeURIComponent(cand)}`;
          console.log(`Fetching division users from: ${endpoint}`);
          const resp = await apiFetcher<any>(endpoint);

          // Quick peek for non-empty before full extraction below
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

        // If none returned non-empty, use the last response for normal handling
        if (typeof data === "undefined") {
          data = lastResp;
        }
      }

      console.log(`Raw API data for division ${divisionId}:`, data);

      let users: any[] = [];

      // Handle different response formats
      if (data.success && Array.isArray(data.data)) {
        users = data.data;
      } else if (Array.isArray(data)) {
        users = data;
      } else if (data.users && Array.isArray(data.users)) {
        users = data.users;
      } else if (data.data && Array.isArray(data.data)) {
        users = data.data;
      } else {
        console.warn(
          `Unexpected data format for division ${divisionId}:`,
          data
        );
        return 0;
      }

      // Filter users by year (angkatan) and approved status
      const filteredUsers = users.filter((user: any) => {
        // Prefer various possible year fields from backend
        const userYearRaw =
          user.angkatan ??
          user.channel_year ??
          user.year ??
          user.tahun ??
          user.batch;
        const userYearNum = Number.parseInt(String(userYearRaw), 10);
        const userStatus = String(user.status ?? "approved").toLowerCase();
        const rawDivision = (
          user.division ??
          user.division_name ??
          user.divisionName ??
          user.division_id ??
          user.divisionId ??
          ""
        ).toString();

        // Normalize to comparable slug-like string
        const normalize = (s: string) =>
          s
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "") // remove spaces, slashes, hyphens
            .replace(/designer|dev|developer/g, ""); // strip suffixes

        const userDivNorm = normalize(rawDivision);

        // For "all" division, just filter by year and status
        if (divisionId === "all") {
          return userYearNum === yearNumber && userStatus === "approved";
        }

        const divIdNorm = normalize(divisionId);
        return (
          userYearNum === yearNumber &&
          userStatus === "approved" &&
          userDivNorm === divIdNorm
        );
      });

      console.log(
        `Filtered users for division ${divisionId}, year ${yearNumber}:`,
        {
          totalUsers: users.length,
          filteredCount: filteredUsers.length,
          targetYear: yearNumber,
          hasToken: !!getAuthToken(),
          sampleUser: users[0], // Log first user for debugging
        }
      );

      return filteredUsers.length;
    } catch (error) {
      console.error(
        `Error fetching real member count for division ${divisionId}:`,
        error
      );

      // If it's an authentication error, provide helpful message
      if (
        error instanceof Error &&
        error.message.includes("Authentication required")
      ) {
        console.warn("API requires authentication. User needs to log in.");
        // You might want to redirect to login or show a login prompt here
      }

      return 0;
    }
  }

  /**
   * Get member count for a specific division and year
   */
  static async getDivisionMemberCount(
    divisionId: string,
    year: string
  ): Promise<number> {
    console.log(
      `Fetching member count for division ${divisionId}, year ${year}`
    );

    try {
      // Use the new real data method
      const count = await this.getRealMemberCount(divisionId, year);
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
  static async getTotalMemberCount(year: string): Promise<number> {
    try {
      const divisions = await this.getAllDivisions();
      let totalCount = 0;

      for (const division of divisions) {
        if (division.id !== "all") {
          // Skip 'all' division to avoid double counting
          const count = await this.getDivisionMemberCount(division.id, year);
          totalCount += count;
        }
      }

      return totalCount;
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
      // Extract year number
      const yearMatch = year.match(/intern-of-sawala-(\d{4})/);
      const yearNumber = yearMatch
        ? parseInt(yearMatch[1])
        : new Date().getFullYear();

      let endpoint: string = "";
      let data: any;

      if (divisionId === "all") {
        endpoint = "/api/users";
        data = await apiFetcher<any>(endpoint);
      } else {
        const candidatesMap: Record<string, string[]> = {
          uiux: ["uiux", "UI/UX", "UI/UX Designer", "ui-ux", "uiux-designer"],
          frontend: ["frontend", "Frontend", "Frontend Dev", "frontend-dev"],
          backend: ["backend", "Backend", "Backend Dev", "backend-dev"],
          devops: ["devops", "DevOps"],
        };
        const candidates = candidatesMap[divisionId] || [divisionId];

        let lastResp: any = null;
        for (const cand of candidates) {
          endpoint = `/api/users/division/${encodeURIComponent(cand)}`;
          const resp = await apiFetcher<any>(endpoint);

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
        if (typeof data === "undefined") {
          data = lastResp;
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

      const normalize = (s: string) =>
        s
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .replace(/designer|dev|developer/g, "");

      const divIdNorm = normalize(divisionId);

      const filteredUsers = users.filter((user: any) => {
        const userYearRaw =
          user.angkatan ??
          user.channel_year ??
          user.year ??
          user.tahun ??
          user.batch;
        const userYearNum = Number.parseInt(String(userYearRaw), 10);
        const userStatus = String(user.status ?? "approved").toLowerCase();

        if (divisionId === "all") {
          return userYearNum === yearNumber && userStatus === "approved";
        }

        const rawDivision = (
          user.division ??
          user.division_name ??
          user.divisionName ??
          user.division_id ??
          user.divisionId ??
          ""
        ).toString();
        const userDivNorm = normalize(rawDivision);

        return (
          userYearNum === yearNumber &&
          userStatus === "approved" &&
          userDivNorm === divIdNorm
        );
      });

      // Map to UI-friendly shape
      const normalizedMembers = filteredUsers.map((u: any) => ({
        id: u?.id ?? u?._id ?? "",
        email: u?.email ?? "",
        username:
          u?.username ??
          u?.full_name ??
          u?.name ??
          (typeof u?.email === "string" ? u.email.split("@")[0] : "User"),
        full_name: u?.full_name ?? u?.name,
        division: u?.division ?? u?.division_id ?? u?.role ?? divisionId,
        angkatan: u?.angkatan ?? u?.channel_year,
        school: u?.school_name ?? u?.school ?? u?.sekolah ?? "",
        avatarSrc: u?.avatarSrc ?? u?.avatar ?? u?.image ?? undefined,
      }));

      return normalizedMembers;
    } catch (error) {
      const apiError = ApiErrorHandler.handleError(error);
      console.error("Error fetching division members:", apiError);
      return [];
    }
  }
}
