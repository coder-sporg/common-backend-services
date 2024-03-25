import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/setup';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import datasource from '../ormconfig';

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
