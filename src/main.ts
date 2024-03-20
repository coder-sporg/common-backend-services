import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'winston-daily-rotate-file';
// import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { ValidationPipe } from '@nestjs/common';
// import { SerializeInterceptor } from './interceptors/serialize.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // 关闭整个nestjs日志
    // logger: false,
    // logger: ['error', 'warn'],
    // logger,
  });

  // 使用 winston 替换 nestjs 默认的日志
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  app.setGlobalPrefix('api/v1');
  // 全局Filter只能有一个
  // app.useGlobalFilters(new HttpExceptionFilter(logger));

  // HttpAdapterHost 是 NestJS 中的一个类，它封装了底层 HTTP 服务器的详细信息。这个类提供了对 HTTP 服务器的直接访问，可以用来获取底层平台（如 Express 或 Fastify）的特定功能。
  // 返回一个 HttpAdapterHost 实例，这个实例包含了当前应用使用的 HTTP 适配器。这个适配器可以用来直接操作底层的 HTTP 服务器，例如添加中间件、注册路由等。
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter));

  // 全局拦截器
  app.useGlobalPipes(
    new ValidationPipe({
      // 去除在类上不存在的字段, 提高接口安全性
      whitelist: true,
    }),
  );

  // app.useGlobalGuards()
  // 弊端 -> 无法使用DI -> 无法访问userService

  // app.useGlobalInterceptors(new SerializeInterceptor()); // 拦截器

  await app.listen(3000);
}
bootstrap();
