import { Injectable, NestMiddleware } from '@nestjs/common';
import * as timeout from 'connect-timeout';

@Injectable()
export class TimeoutMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const timeoutDuration = process.env.API_TIMEOUT || '10s'; // Use value from .env
    timeout(timeoutDuration)(req, res, next); // Apply timeout
  }
}
