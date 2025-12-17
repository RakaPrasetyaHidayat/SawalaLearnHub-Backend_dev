import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get supabaseConfig() {
    return {
      url: this.configService.get<string>("SUPABASE_URL"),
      anonKey: this.configService.get<string>("SUPABASE_ANON_KEY"),
      serviceRoleKey: this.configService.get<string>(
        "SUPABASE_SERVICE_ROLE_KEY",
      ),
    };
  }

  get jwtConfig() {
    return {
      secret: this.configService.get<string>("JWT_SECRET"),
    };
  }

  get apiConfig() {
    return {
      globalPrefix: "api",
      enableVersioning: true,
      versioningType: "uri",
      defaultVersion: "v1",
      enableCors: true,
      cors: {
        origin: true,
        credentials: true,
      },
    };
  }
}
