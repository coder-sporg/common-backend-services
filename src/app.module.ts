import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { RolesModule } from './roles/roles.module';
import { LogsModule } from './logs/logs.module';
import { AuthModule } from './auth/auth.module';
import { MenusModule } from './menus/menus.module';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

import { connectionParams } from '../ormconfig';

// 通过 @Global 装饰器全局进行使用
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      // 声明全局模块，其他模块使用时无需在 module 中使用 imports 导入
      isGlobal: true,
      // 自定义 env 文件路径
      envFilePath: envFilePath,
      // 加载.env文件，并将其中的变量赋值给process.env，默认配置可以读取
      load: [() => dotenv.config({ path: '.env' })],
      // 禁止加载环境变量
      ignoreEnvFile: false,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        // 验证.env文件中的变量是否符合要求
        // 对数据库类型做校验
        DB_TYPE: Joi.string().valid('mysql', 'postgres', 'mongodb'),
        DB_HOST: Joi.alternatives().try(
          Joi.string().ip(),
          Joi.string().domain(),
        ),
        DB_PORT: Joi.number().default(3306).valid(3306, 3307, 3308),
        DB_DATABASE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
        DB_URL: Joi.string().domain(),
        LOG_ON: Joi.boolean(),
        LOG_LEVEL: Joi.string(),
      }),
    }),
    TypeOrmModule.forRoot(connectionParams),
    // 固定写法，不能根据配置获取
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'example',
    //   database: 'testdb',
    //   entities: [],
    //   // 同步本地的schema与数据库 => 初始化的时候使用
    //   synchronize: true,
    //   // 设置日志级别为error
    //   logging: ['error'],
    // }),,
    UserModule,
    RolesModule,
    LogsModule,
    AuthModule,
    MenusModule,
  ],
  controllers: [],
  // 从 nestjs/common 中引入Logger,因为在main.ts中对 Logger 进行了重写
  providers: [
    Logger,
    // {
    //   provide: APP_GUARD,
    //   useClass: AdminGuard,
    // },
  ],
  // 进行导出，供其他模块可以直接使用 注意 @Global()
  exports: [Logger],
})
export class AppModule {}
