import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/setup';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import datasource from '../ormconfig';
import { readFileSync } from 'fs';
import { join } from 'path';

// 方法一：const app = new AppFactory().init() init -> return app实例
// 方法二：OOP get instance() -> app ,private app, AppFactory constructor的部分进行初始化
//  const appFactory = AppFactory.init() -> const app = appFactory.instance
export class AppFactory {
  connection: DataSource;
  constructor(private app: INestApplication) {}

  get instance() {
    return this.app;
  }

  // 初始化 app 实例
  static async init() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    setupApp(app);
    const port = 3000;
    await app.listen(port);
    await app.init();
    return new AppFactory(app);
  }

  // 初始化数据库
  async initDB() {
    if (!datasource.isInitialized) {
      await datasource.initialize();
    }

    this.connection = datasource;

    // 测试的基础的字典数据写入到数据库中
    // Method1: this.connection.runMigrations() 需要关闭 DB_SYNC
    // Method2: 写入SQL语句
    const queryRunner = this.connection.createQueryRunner();

    const sql =
      readFileSync(join(__dirname, '../src/migrations/init.sql'), 'utf-8')
        .toString()
        .replace(/\r?\n|\r/g, '')
        .split(';') || [];

    for (const item of sql) {
      await queryRunner.query(item);
    }
  }

  // 清除数据库的数据 -> 避免测试时数据污染
  async cleanup() {
    const entities = this.connection.entityMetadatas;
    for (const entity of entities) {
      const repository = this.connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    }
  }

  // 断开与数据库的连接 -> 避免后序数据库连接过多而无法连接
  async closeDB() {
    await this.connection?.destroy();
  }
}
