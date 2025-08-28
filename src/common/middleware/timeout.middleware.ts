import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TimeoutMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const timeoutDuration = parseInt(process.env.API_TIMEOUT || '10000'); // Convert to milliseconds
    
    // Set a timeout for the request
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          status: 'error',
          message: 'Request timeout',
          code: 'TIMEOUT'
        });
      }
    }, timeoutDuration);

    // Clear timeout when response finishes
    res.on('finish', () => {
      clearTimeout(timer);
    });

    // Clear timeout when response closes
    res.on('close', () => {
      clearTimeout(timer);
    });

    next();
  }
}
