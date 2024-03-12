import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { WinstonModule, WinstonModuleOptions, utilities } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { Console } from 'winston/lib/winston/transports';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { LogEnum } from '../enum/config.enum';

function createDailyRotateFileTransport(level: string, filename: string) {
  return new DailyRotateFile({
    level,
    dirname: 'logs',
    filename: `${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    // 最多文件数量
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple(),
    ),
  });
}

@Module({
  imports: [
    // 异步的方式来加载
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const consoleTransport = new Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            // 为控制台传输提供了一个类似于 Nest 的自定义特殊格式化程序 配置项 colors, prettyPrint 默认为 true
            utilities.format.nestLike(),
          ),
        });

        // 此处有个 bug 只要 new 了实例，就会生成日志文件，所以下面的 LOG_ON 判断无效了
        // const dailyWarnTransport = new DailyRotateFile({
        //   level: 'warn',
        //   dirname: 'logs',
        //   filename: 'application-%DATE%.log',
        //   datePattern: 'YYYY-MM-DD-HH',
        //   zippedArchive: true,
        //   maxSize: '20m',
        //   // 最多文件数量
        //   maxFiles: '14d',
        //   format: winston.format.combine(
        //     winston.format.timestamp(),
        //     winston.format.simple(),
        //   ),
        // });
        // const dailyInfoTransport = new DailyRotateFile({
        //   level: configService.get(LogEnum.LOG_LEVEL),
        //   dirname: 'logs',
        //   filename: 'info-%DATE%.log',
        //   datePattern: 'YYYY-MM-DD-HH',
        //   zippedArchive: true,
        //   maxSize: '20m',
        //   // 最多文件数量
        //   maxFiles: '14d',
        //   format: winston.format.combine(
        //     winston.format.timestamp(),
        //     winston.format.simple(),
        //   ),
        // });

        return {
          transports: [
            consoleTransport,
            ...(configService.get(LogEnum.LOG_ON)
              ? [
                  createDailyRotateFileTransport('warn', 'error'),
                  createDailyRotateFileTransport(
                    configService.get(LogEnum.LOG_LEVEL),
                    'application',
                  ),
                ]
              : []),
          ],
        } as WinstonModuleOptions;
      },
    }),
  ],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}
