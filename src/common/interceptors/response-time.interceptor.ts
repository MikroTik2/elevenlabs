import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
     intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
          const start = Date.now();
          return next
               .handle()
               .pipe(tap(() => console.log(`Response time: ${Date.now() - start}ms`)));     
     };
};