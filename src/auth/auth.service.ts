import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signin(username: string, password: string) {
    const user = await this.userService.find(username);

    if (user && user.password === password) {
      return await this.jwtService.signAsync(
        {
          username: user.username,
          sub: user.id,
        },
        // 局部设置，refreshToken 中使用
        // {
        //   expiresIn: '1d',
        // },
      );
    }
    throw new ForbiddenException('用户名或密码错误');
  }

  async signup(username: string, password: string) {
    const user = await this.userService.find(username);
    if (user) {
      throw new ForbiddenException('用户名已存在');
    }
    const res = this.userService.create({ username, password });
    return res;
  }
}
