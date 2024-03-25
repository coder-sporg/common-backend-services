import * as Spec from 'pactum/src/models/Spec';

describe('Auth登录认证 e2e测试', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let spec: Spec;
  beforeEach(() => {
    spec = global.spec as Spec;
  });

  // 注册用户
  it('注册用户', async () => {
    const user = {
      username: 'admin-1',
      password: '12345678',
    };
    return spec
      .post('/api/v1/auth/signup')
      .withBody(user)
      .expectStatus(201) // 201 表示请求已成功处理，并在服务器上创建了一个新的资源
      .expectBodyContains(user.username)
      .expectJsonLike({
        id: 1,
        username: user.username,
        roles: [
          {
            id: 4,
            name: '访客',
          },
        ],
      });
  });

  // 重复注册用户
  it('重复注册用户', async () => {
    const user = {
      username: 'admin-1',
      password: '12345678',
    };

    await global.pactum
      .spec()
      .post('/api/v1/auth/signup')
      .withBody(user)
      .expectStatus(201);

    return spec // 一个 spec 是一个实例，只能发送一个请求
      .post('/api/v1/auth/signup')
      .withBody(user)
      .expectStatus(403)
      .expectBodyContains('用户名已存在');
  });

  // 注册用户传参异常 username password -> 长度，类型，空
  it('注册用户传参异常 username', async () => {
    const user = {
      username: 'test',
      password: '12345678',
    };

    return spec
      .post('/api/v1/auth/signup')
      .withBody(user)
      .expectStatus(400)
      .expectBodyContains(
        `用户名长度必须在6到20之间，当前传递的值是：${user.username}`,
      );
  });

  // 登录用户
  it('登录用户', async () => {
    const user = {
      username: 'admin-1',
      password: '12345678',
    };

    await global.pactum
      .spec()
      .post('/api/v1/auth/signup')
      .withBody(user)
      .expectStatus(201);

    return spec
      .post('/api/v1/auth/signin')
      .withBody(user)
      .expectStatus(201)
      .expectBodyContains('access_token');
  });

  // 登录用户传参异常 username password -> 长度，类型，空
  it('登录用户传参异常 username', async () => {
    const user = {
      username: 'admin-1',
      password: '12345678',
    };

    await global.pactum.spec().post('/api/v1/auth/signup').withBody(user);

    return spec
      .post('/api/v1/auth/signin')
      .withBody({
        username: '',
        password: '123456',
      })
      .expectStatus(400)
      .expectBodyContains('用户名长度必须在6到20之间，当前传递的值是：');
  });

  // 登录用户不存在
  it('登录用户不存在', async () => {
    // const user = {
    //   username: 'admin-1',
    //   password: '12345678',
    // };

    // await global.pactum.spec().post('/api/v1/auth/signup').withBody(user); // 注册成功后状态码为 201

    return spec
      .post('/api/v1/auth/signin')
      .withBody({
        username: 'admin-1',
        password: '12345678',
      })
      .expectStatus(403)
      .expectBodyContains('用户不存在，请注册');
  });

  // 登录用户密码错误
  it('登录用户密码错误', async () => {
    const user = {
      username: 'admin-1',
      password: '12345678',
    };

    await global.pactum.spec().post('/api/v1/auth/signup').withBody(user);

    return spec
      .post('/api/v1/auth/signin')
      .withBody({
        username: 'admin-1',
        password: '123456',
      })
      .expectStatus(403)
      .expectBodyContains('用户名或密码错误');
  });

  // 补充说明：
  // user模块 -> headers -> token信息 -> beforeEach -> 获取token
});
