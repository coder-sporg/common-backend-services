import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signin(username: string, password: string) {
    const user = await this.userService.find(username);

    if (!user) {
      throw new ForbiddenException('用户不存在，请注册');
    }

    // 用户密码进行比对
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      throw new ForbiddenException('用户名或密码错误');
    }

    return await this.jwtService.signAsync({
      username: user.username,
      sub: user.id,
    });

    // if (user && user.password === password) {
    //   return await this.jwtService.signAsync(
    //     {
    //       username: user.username,
    //       sub: user.id,
    //     },
    //     // 局部设置，refreshToken 中使用
    //     // {
    //     //   expiresIn: '1d',
    //     // },
    //   );
    // }
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
