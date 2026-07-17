import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ApiResponse } from '@customer-reg/shared'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'success' in data) {
          return data as ApiResponse<T>
        }
        return { success: true, data }
      }),
    )
  }
}
