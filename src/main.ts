import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as winston from 'winston';
import { createLogger } from 'winston';
import { WinstonModule, utilities } from 'nest-winston';
import 'winston-daily-rotate-file';
// import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AllExceptionFilter } from './filters/all-exception.filter';

async function bootstrap() {
  // createLogger of Winston
  const instance = createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          // 为控制台传输提供了一个类似于 Nest 的自定义特殊格式化程序 配置项 colors, prettyPrint 默认为 true
          utilities.format.nestLike(),
        ),
      }),
      // events archive rotate 一些事件钩子
      new winston.transports.DailyRotateFile({
        level: 'warn',
        dirname: 'logs',
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        // 最多文件数量，14天，超过的会删除
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple(),
        ),
      }),
      new winston.transports.DailyRotateFile({
        level: 'info',
        dirname: 'logs',
        filename: 'info-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        // 最多文件数量
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple(),
        ),
      }),
    ],
  });
  const logger = WinstonModule.createLogger(instance);
  const app = await NestFactory.create(AppModule, {
    // 关闭整个nestjs日志
    // logger: false,
    // logger: ['error', 'warn'],
    logger,
  });
  app.setGlobalPrefix('api/v1');
  // 全局Filter只能有一个
  // app.useGlobalFilters(new HttpExceptionFilter(logger));

  // HttpAdapterHost 是 NestJS 中的一个类，它封装了底层 HTTP 服务器的详细信息。这个类提供了对 HTTP 服务器的直接访问，可以用来获取底层平台（如 Express 或 Fastify）的特定功能。
  // 返回一个 HttpAdapterHost 实例，这个实例包含了当前应用使用的 HTTP 适配器。这个适配器可以用来直接操作底层的 HTTP 服务器，例如添加中间件、注册路由等。
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter));

  await app.listen(3000);
}
bootstrap();
