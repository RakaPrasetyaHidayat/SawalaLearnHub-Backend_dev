export type ApiConfig = {
  globalPrefix: string; // e.g., 'api'
  enableVersioning: boolean;
  versioningType: "uri" | "header";
  defaultVersion: string; // e.g., 'v1'
  enableCors: boolean;
  cors: {
    origin: string[] | string | boolean; // '*' -> true
    credentials: boolean;
  };
};

export const API_CONFIG = "API_CONFIG" as const;
