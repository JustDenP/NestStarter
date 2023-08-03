import { TIMEOUT_METADATA_KEY } from '@common/decorators/timeout-decorator';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { catchError, Observable, retry, tap, throwError, timeout } from 'rxjs';

@Injectable()
export class StaticTimeoutInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const timeoutValue = this.reflector.get<number>(TIMEOUT_METADATA_KEY, context.getHandler());
    const timeoutValueDefault = 2000;

    // retry-options
    const retryCount = 3;

    return next.handle().pipe(
      timeout(timeoutValue ? timeoutValue : timeoutValueDefault),
      retry(retryCount),
      catchError((error) => {
        if (error.name === 'TimeoutError') {
          console.log(
            `Timeout of ${timeoutValue ? timeoutValue : timeoutValueDefault} ms exceeded.`,
          );

          return throwError(() => new HttpException('Request Timeout', HttpStatus.REQUEST_TIMEOUT));
        }

        return throwError(() => error);
      }),
      tap(() => {
        console.log('Request completed.');
      }),
    );
  }
}
