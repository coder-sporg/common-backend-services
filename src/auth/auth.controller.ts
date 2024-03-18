import {
  Body,
  Controller,
  HttpException,
  Post,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeormFilter } from '../filters/typeorm.filter';

// export function TypeOrmDecorator() {
//   return UseFilters(new TypeormFilter());
// }

@UseFilters(new TypeormFilter())
// TypeOrmDecorator() // 自己创建的登录注解
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  signin(@Body() dto: any) {
    const { username, password } = dto;
    return this.authService.signin(username, password);
  }

  @Post('/signup')
  signup(@Body() dto: any) {
    const { username, password } = dto;
    if (!username || !password) {
      throw new HttpException('用户名或密码不能为空', 400);
    }
    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new HttpException('用户名或密码格式不正确', 400);
    }
    if (
      !(typeof username == 'string' && username.length >= 6) ||
      !(typeof password === 'string' && password.length >= 6)
    ) {
      throw new HttpException('用户名密码必须长度超过6', 400);
    }
    return this.authService.signup(username, password);
  }
}
