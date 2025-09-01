import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, createSuccessResponse } from '../utils/api.utils';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => {
        // If response is already formatted, return as is
        if (data?.status === 'success' || data?.status === 'error') {
          return data;
        }

        // Format the response
        return createSuccessResponse(data);
      }),
    );
  }
}
