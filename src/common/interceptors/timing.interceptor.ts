import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('TIMING');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const start = process.hrtime.bigint();

    return next.handle().pipe(
      tap(() => {
        const ms = Number(process.hrtime.bigint() - start) / 1e6;
        const time = ms.toFixed(2);
        response.setHeader('X-Response-Time', `${time}ms`);
        this.logger.log(
          `Маршрут ${request.method} ${request.url} виконано за ${time}ms`,
        );
      }),
    );
  }
}
