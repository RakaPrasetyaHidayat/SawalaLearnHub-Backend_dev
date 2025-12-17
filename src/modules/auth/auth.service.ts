import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { SupabaseService } from "../../infra/supabase/supabase.service";
import { RegisterDto, LoginDto } from "./dto/auth.dto";
import {
  UserRole,
  UserStatus,
  Division,
} from "../../common/enums/database.enum";

export interface AuthResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  channel_year?: number;
  school_name?: string;
  division_id: Division;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    full_name?: string;
    role: UserRole;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Client Supabase pakai service_role
   */
  private get adminClient() {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("❌ Missing SUPABASE_SERVICE_ROLE_KEY in env");
    }
    return this.supabaseService.getClient(true);
  }

  private async handleDatabaseOperation<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    try {
      return await operation();
    } catch (err: any) {
      // Avoid leaking internals, but keep meaningful mapping
      const message = typeof err?.message === "string" ? err.message : "";
      console.error("Database operation error:", {
        message,
        code: err?.code,
        details: err?.details,
        hint: err?.hint,
      });

      if (message.includes("API key")) {
        throw new InternalServerErrorException(
          "Database configuration error: Invalid API key",
        );
      }
      if (message.includes("JWT")) {
        throw new UnauthorizedException("Invalid or expired token");
      }
      if (message.includes("duplicate key") || err?.code === "23505") {
        throw new BadRequestException("Resource already exists");
      }
      if (message.includes("not found")) {
        throw new NotFoundException("Resource not found");
      }

      if (err instanceof HttpException) {
        // Preserve already-formed HTTP exceptions (e.g., UnauthorizedException thrown inside operation)
        throw err;
      }

      // Generic error handling
      throw new InternalServerErrorException(
        message || "Database operation failed",
      );
    }
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse<AuthUser>> {
    return this.handleDatabaseOperation(async () => {
      const email = registerDto.email.toLowerCase().trim();

      const { data: existingUser, error: searchError } = await this.adminClient
        .from("users")
        .select("id, email, status")
        .eq("email", email)
        .maybeSingle();

      if (searchError)
        throw new InternalServerErrorException(searchError.message);

      if (existingUser) {
        throw new BadRequestException({
          message: "User already exists",
          details:
            existingUser.status === UserStatus.PENDING
              ? "Your registration is pending approval"
              : "An account with this email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const currentYear = new Date().getFullYear();

      const userData = {
        email,
        password: hashedPassword,
        full_name: registerDto.full_name,
        role: UserRole.SISWA,
        status: UserStatus.PENDING,
        channel_year: registerDto.channel_year || currentYear,
        division_id: null,
        school_name: registerDto.school_name || null,
      };

      // Accept division input from frontend as friendly name (e.g. 'Backend', 'Frontend', 'UI/UX', 'DevOps')
      // and resolve it to the division UUID stored in the divisions table. If the client already
      // provided a UUID, use it directly.
      if (registerDto.division_id) {
        const maybe = String(registerDto.division_id).trim();
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(maybe)) {
          userData.division_id = maybe;
        } else {
          // Try to resolve by name. Prefer exact case-insensitive match, then normalized match, then ilike fuzzy.
          const client = this.adminClient;
          const { data: allDivs, error: divErr } = await client
            .from("divisions")
            .select("id,name");
          if (divErr)
            throw new InternalServerErrorException(
              "Failed to load divisions list",
            );

          const normalize = (s: string) =>
            String(s || "")
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "");
          const exact = (allDivs || []).find(
            (d: any) => String(d.name).toLowerCase() === maybe.toLowerCase(),
          );
          if (exact) {
            userData.division_id = exact.id;
          } else {
            const norm = normalize(maybe);
            const normalizedMatch = (allDivs || []).find(
              (d: any) => normalize(d.name) === norm,
            );
            if (normalizedMatch) {
              userData.division_id = normalizedMatch.id;
            } else {
              // fallback: DB fuzzy search
              const { data: fuzzy, error: fuzzyErr } = await client
                .from("divisions")
                .select("id,name")
                .ilike("name", `%${maybe}%`);
              if (fuzzyErr)
                throw new InternalServerErrorException(
                  "Failed to search divisions",
                );
              if (!fuzzy || fuzzy.length === 0) {
                const available = (allDivs || [])
                  .map((d: any) => d.name)
                  .join(", ");
                throw new BadRequestException(
                  `Division not found; available: ${available}`,
                );
              }
              if (fuzzy.length > 1) {
                // ambiguous
                const names = fuzzy.map((d: any) => d.name).join(", ");
                throw new BadRequestException(
                  `Multiple divisions matched: ${names}. Please provide exact division name or UUID.`,
                );
              }
              userData.division_id = fuzzy[0].id;
            }
          }
        }
      }

      const { data: user, error: insertError } = await this.adminClient
        .from("users")
        .insert([userData])
        .select(
          "id, email, full_name, role, status, channel_year, school_name, division_id, avatar_url",
        )
        .single();

      if (insertError)
        throw new InternalServerErrorException(insertError.message);
      if (!user)
        throw new InternalServerErrorException("Failed to create user");

      return {
        status: "success",
        message: "Registration successful. Please wait for admin approval.",
        data: user,
      };
    });
  }

  async login(loginDto: LoginDto): Promise<AuthResponse<LoginResponse>> {
    return this.handleDatabaseOperation(async () => {
      const email = loginDto.email.toLowerCase().trim();

      const { data: user, error: searchError } = await this.adminClient
        .from("users")
        .select("id, email, full_name, role, status, password")
        .eq("email", email)
        .maybeSingle();

      if (searchError)
        throw new InternalServerErrorException(searchError.message);
      if (!user) throw new UnauthorizedException("Invalid credentials");

      console.log("🔍 User found from DB:", user);

      if (user.status === UserStatus.PENDING) {
        throw new UnauthorizedException({
          message: "Account is pending approval",
          status: user.status,
          details: "Please wait for admin approval",
        });
      }
      if (user.status === UserStatus.REJECTED) {
        throw new UnauthorizedException({
          message: "Account has been rejected",
          status: user.status,
          details: "Please contact administrator",
        });
      }
      if (user.status !== UserStatus.APPROVED) {
        throw new UnauthorizedException({
          message: `Invalid account status: ${user.status}`,
          status: user.status,
          details: "Contact administrator for assistance",
        });
      }

      const isPasswordValid = user?.password
        ? await bcrypt.compare(loginDto.password, user.password)
        : false;
      if (!isPasswordValid)
        throw new UnauthorizedException("Invalid credentials");

      const payload = { sub: user.id, email: user.email, role: user.role };
      const access_token = await this.jwtService.signAsync(payload);

      return {
        status: "success",
        message: "Login successful",
        data: {
          access_token,
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
          },
        },
      };
    });
  }

  async me(userId: string): Promise<AuthResponse<AuthUser>> {
    return this.handleDatabaseOperation(async () => {
      // Fetch core user fields from the users table (keeps internal fields like password isolated)
      const { data: user, error } = await this.adminClient
        .from("users")
        .select(
          "id, email, full_name, role, status, channel_year, school_name, division_id, avatar_url",
        )
        .eq("id", userId)
        .maybeSingle();

      if (error) throw new InternalServerErrorException(error.message);
      if (!user) throw new UnauthorizedException("User not found");

      // Additionally, fetch division-related data from the users_with_division view
      // and merge it into the returned profile. This ensures division info comes from the view.
      try {
        const { data: viewUser, error: viewErr } = await this.adminClient
          .from("users_with_division")
          // select only division-related fields the view is expected to provide
          .select("division_id, division_name, channel_year")
          .eq("id", userId)
          .maybeSingle();

        if (!viewErr && viewUser) {
          // Prefer view values when present. Provide a friendly label for UI.
          if (typeof viewUser.division_id !== "undefined")
            user.division_id = viewUser.division_id;
          if (typeof viewUser.division_name !== "undefined") {
            (user as any).division_name = viewUser.division_name;
            // Friendly label used by frontend to show text instead of UUID
            (user as any).division_label = viewUser.division_name;
          } else if (user.division_id) {
            // Fallback: if view doesn't provide name but user has division_id (string), use it as label
            (user as any).division_label = String(user.division_id);
          }
          if (typeof viewUser.channel_year !== "undefined")
            user.channel_year = viewUser.channel_year;
        } else {
          // If view read failed, still provide a label fallback using division_id
          if (!(user as any).division_label && user.division_id) {
            (user as any).division_label = String(user.division_id);
          }
        }
      } catch (e) {
        // Non-fatal: if view read fails, return core user data anyway
        // Logging omitted to avoid throwing from me endpoint
      }

      return {
        status: "success",
        message: "User profile retrieved successfully",
        data: user,
      };
    });
  }

  // Healthcheck: simple query to validate DB connectivity/env
  async dbCheck() {
    return this.handleDatabaseOperation(async () => {
      const { error, count } = await this.adminClient
        .from("users")
        .select("id", { count: "exact", head: true });

      if (error) {
        throw new InternalServerErrorException(error.message);
      }

      return {
        status: "success",
        message: "Database reachable",
        data: { table: "users", countKnown: typeof count === "number" },
      };
    });
  }
}
