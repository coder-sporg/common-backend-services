import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { User } from '../../user/user.entity';
import { SigninUserDto } from '../dto/signin-user.dto';
import { Roles } from '../../roles/roles.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    // 模拟的AuthService -> 与后续的依赖项UserService等无关联的依赖项
    mockAuthService = {
      signin(username: string, password: string) {
        console.log('sign', username, password);
        return Promise.resolve('token');
      },
      signup(username: string, password: string) {
        const user = new User();
        user.username = username;
        // user.password = password;
        user.roles = [{ id: 1, name: '管理员' }] as Roles[];

        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('鉴权-初始化-实例化', () => {
    expect(controller).toBeDefined();
  });

  it('鉴权-控制器-登录', async () => {
    const res = controller.signin({
      username: 'test',
      password: '123456',
    } as SigninUserDto);

    expect(await res).not.toBeNull();
    expect((await res).access_token).toBe('token'); // 返回的 token
  });

  it('鉴权-控制器-注册', async () => {
    const res = controller.signup({
      username: 'test',
      password: '123456',
    });

    expect(await res).not.toBeNull();
    expect((await res).id).not.toBeNull();
    expect((await res).password).toBeUndefined();
    expect((await res) instanceof User).toBeTruthy();

    expect((await res).username).toBe('test');
    expect((await res).roles.length).toBe(1);
  });
});
