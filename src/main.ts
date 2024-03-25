import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'winston-daily-rotate-file';
import { setupApp } from './setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // 关闭整个nestjs日志
    // logger: false,
    // logger: ['error', 'warn'],
    // logger,
    cors: true, // 运行跨域
  });

  setupApp(app);

  const port = 3000;
  await app.listen(port);
}
bootstrap();
