import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  // HttpException,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeormFilter } from '../filters/typeorm.filter';
import { SigninUserDto } from './dto/signin-user.dto';
// import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

// export function TypeOrmDecorator() {
//   return UseFilters(new TypeormFilter());
// }

@Controller('auth')
// TypeOrmDecorator() // 自己创建的登录注解
// @UseInterceptors(SerializeInterceptor) // 为controller 使用拦截器
@UseInterceptors(ClassSerializerInterceptor) // 过滤掉密码的显示 需要在 user.entity.ts 中写 @Exclude
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 仅仅作为单元测试
  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Post('/signin')
  async signin(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    const token = await this.authService.signin(username, password);
    return {
      access_token: token,
    };
  }

  @Post('/signup')
  // @UseInterceptors(SerializeInterceptor)
  signup(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    // if (!username || !password) {
    //   throw new HttpException('用户名或密码不能为空', 400);
    // }
    // if (typeof username !== 'string' || typeof password !== 'string') {
    //   throw new HttpException('用户名或密码格式不正确', 400);
    // }
    // if (
    //   !(typeof username == 'string' && username.length >= 6) ||
    //   !(typeof password === 'string' && password.length >= 6)
    // ) {
    //   throw new HttpException('用户名密码必须长度超过6', 400);
    // }
    return this.authService.signup(username, password);
  }
}
