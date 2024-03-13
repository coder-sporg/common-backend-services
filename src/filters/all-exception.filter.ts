import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import * as requestIp from 'request-ip';
// import { QueryFailedError } from 'typeorm';

// 没有参数，就是所有的异常
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private logger: LoggerService,
    private httpAdapter: HttpAdapterHost,
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    // 获取 http 适配器
    const { httpAdapter } = this.httpAdapter;
    const ctx = host.switchToHttp();
    // 响应 请求对象
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const msg: unknown = exception['response'] || 'Internal Server Error';

    // 加入更多异常错误逻辑
    // QueryFailedError（查询错误） instanceOf TypeORMError
    // if (exception instanceof QueryFailedError) {
    //   msg = exception.message;
    //   if (exception.driverError.errno === 1062) {
    //     msg = '唯一索引冲突';
    //   }
    // }

    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      // 请求 ip
      ip: requestIp.getClientIp(request),
      exception: exception['name'],
      error: msg,
    };

    this.logger.error('[all-filter-test]', responseBody);
    // 使用一个 HTTP 适配器（httpAdapter）来回复一个 HTTP 响应（response），响应体（responseBody）和状态（status）。
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
