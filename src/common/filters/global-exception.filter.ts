import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { PostgrestError } from '@supabase/supabase-js';
import { createErrorResponse } from '../utils/api.utils';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.error('[GlobalExceptionFilter] Exception caught:', exception);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any).message || message;
      error = (exceptionResponse as any).error;
    } else if ((exception as any)?.code === 'PGRST301') {
      // Supabase row level security violation
      status = HttpStatus.FORBIDDEN;
      message = 'Access denied';
    } else if (exception instanceof PostgrestError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      error = {
        code: exception.code,
        details: exception.details,
        hint: exception.hint
      };
    } else if ((exception as any)?.code) {
      // Handle Supabase/PostgreSQL errors
      status = HttpStatus.BAD_REQUEST;
      message = (exception as any).message || 'Database error';
      error = {
        code: (exception as any).code,
        details: (exception as any).details,
        hint: (exception as any).hint
      };
    } else if (exception instanceof Error) {
      message = exception.message;
      error = process.env.NODE_ENV === 'development' ? {
        stack: exception.stack,
        name: exception.name
      } : undefined;
    }

    const errorResponse = createErrorResponse(message, error);
    console.error('[GlobalExceptionFilter] Sending error response:', errorResponse);

    response
      .status(status)
      .json(errorResponse);
  }
}
