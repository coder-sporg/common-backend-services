import { INestApplication } from '@nestjs/common';
import { AppFactory } from './app.factory';
import * as pactum from 'pactum';

// 设置全局的 jest 的 beforeEach 和 afterEach
let appFactory: AppFactory;
let app: INestApplication;
global.beforeEach(async () => {
  // const moduleFixture: TestingModule = await Test.createTestingModule({
  //   imports: [AppModule],
  // }).compile();

  // app = moduleFixture.createNestApplication();
  // setupApp(app);
  // await app.init();

  appFactory = await AppFactory.init();
  await appFactory.closeDB(); // 初始化时 清空数据库
  await appFactory.initDB();
  app = appFactory.instance;

  // 设置全局的 pactum 请求前缀
  pactum.request.setBaseUrl(await app.getUrl());
  global.pactum = pactum;
  global.spec = pactum.spec();
});

global.afterEach(async () => {
  // await appFactory.cleanup();
  await appFactory?.closeDB();
  // 关闭当前进程
  await app?.close();
});
