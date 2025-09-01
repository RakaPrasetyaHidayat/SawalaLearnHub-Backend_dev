import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PostgrestError } from '@supabase/supabase-js';

@Injectable()
export class DatabaseErrorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalSend = res.send;

    res.send = function(body: any) {
      if (body?.error instanceof PostgrestError) {
        const errorResponse = {
          status: 'error',
          message: 'Database operation failed',
          error: process.env.NODE_ENV === 'development' ? body.error.message : 'Internal server error',
          code: body.error.code
        };
        
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        return originalSend.call(this, errorResponse);
      }
      return originalSend.call(this, body);
    };

    next();
  }
}
