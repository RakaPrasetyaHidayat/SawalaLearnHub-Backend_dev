import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get apiConfig() {
    return {
      globalPrefix: 'api',
      enableVersioning: true,
      versioningType: 'uri',
      defaultVersion: 'v1',
      enableCors: true,
      cors: {
        origin: true,
        credentials: true,
      },
    };
  }
}
