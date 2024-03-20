import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {} // 接收一个 dto
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const req = context.switchToHttp().getRequest();
    // console.log('这里在拦截器执行之前', req);
    return next.handle().pipe(
      map((data) => {
        // console.log('这里在拦截器执行之后', data); // 这里的 data 是返回的数据
        // return data;
        return plainToInstance(this.dto, data, {
          // 设置为true之后，所有经过该interceptor的接口都需要设置Expose或Exclude
          // Expose就是设置哪些字段需要暴露，Exclude就是设置哪些字段不需要暴露
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
