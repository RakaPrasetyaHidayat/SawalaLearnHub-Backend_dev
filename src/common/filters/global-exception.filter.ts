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
      message = exception.message;
      error = {
        code: exception.code,
        details: exception.details,
        hint: exception.hint
      };
    } else if (exception instanceof Error) {
      message = exception.message;
      error = process.env.NODE_ENV === 'development' ? exception : undefined;
    }

    response
      .status(status)
      .json(createErrorResponse(message, error));
  }
}
