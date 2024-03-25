import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../user/user.entity';
import { ForbiddenException } from '@nestjs/common';
import * as argon2 from 'argon2';

describe('AuthService（登录认证模块-服务）', () => {
  let service: AuthService;
  let userService: Partial<UserService>;
  let jwt: Partial<JwtService>;

  let userArr: User[] = []; // 用户数据 缓存
  const mockUser = {
    username: 'super-admin',
    password: '123456',
  };

  beforeEach(async () => {
    userArr = [];
    userService = {
      find: (username: string) => {
        const user = userArr.find((item) => item.username === username);
        return Promise.resolve(user as User);
      },

      create: async (user: Partial<User>) => {
        const newUser = new User();
        newUser.id = Math.floor(Math.random() * 1000);
        newUser.username = user.username;
        newUser.password = await argon2.hash(user.password);
        userArr.push(newUser);
        return Promise.resolve(newUser);
      },
    };

    jwt = {
      signAsync: () => {
        return Promise.resolve('token');
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: JwtService,
          useValue: jwt,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    // 每次测试用例都清空缓存
    userArr = [];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('用户初次注册', async () => {
    const user = await service.signup(mockUser.username, mockUser.password);

    expect(user).toBeDefined();
    expect(user.username).toBe(mockUser.username);
  });

  it('用户使用相同的用户名再次注册', async () => {
    await service.signup(mockUser.username, mockUser.password);

    await expect(
      service.signup(mockUser.username, mockUser.password),
    ).rejects.toThrowError();

    await expect(
      service.signup(mockUser.username, mockUser.password),
    ).rejects.toThrow(new ForbiddenException('用户名已存在'));
  });

  it('用户登录', async () => {
    // 注册新用户
    await service.signup(mockUser.username, mockUser.password);

    // 登录
    expect(await service.signin(mockUser.username, mockUser.password)).toBe(
      'token',
    );
  });
  it('用户登录，用户名密码错误', async () => {
    // 注册新用户
    await service.signup(mockUser.username, mockUser.password);

    await expect(
      service.signin(mockUser.username, '12345678'),
    ).rejects.toThrowError();

    await expect(service.signin(mockUser.username, '12345678')).rejects.toThrow(
      new ForbiddenException('用户名或密码错误'),
    );
  });
  it('用户登录，用户名不存在', async () => {
    // 注册新用户 注册之后，下面的测试用例失败
    // await service.signup(mockUser.username, mockUser.password);

    await expect(
      service.signin(mockUser.username, mockUser.password),
    ).rejects.toThrowError();

    await expect(
      service.signin(mockUser.username, mockUser.password),
    ).rejects.toThrow(new ForbiddenException('用户不存在，请注册'));
  });
});
