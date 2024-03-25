import { AppFactory } from './app.factory';

// 设置全局的 jest 的 beforeEach 和 afterEach
let appFactory: AppFactory;
global.beforeEach(async () => {
  // const moduleFixture: TestingModule = await Test.createTestingModule({
  //   imports: [AppModule],
  // }).compile();

  // app = moduleFixture.createNestApplication();
  // setupApp(app);
  // await app.init();

  appFactory = await AppFactory.init();
  await appFactory.initDB();
  // app = appFactory.instance;
});

global.afterEach(async () => {
  await appFactory.cleanup();
  // await appFactory.closeDB();
});
