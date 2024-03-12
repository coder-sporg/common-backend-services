import {
  Controller,
  Delete,
  Get,
  // HttpException,
  // HttpStatus,
  Logger,
  // NotFoundException,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { ConfigEnum } from 'src/enum/config.enum';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
    // private configService: ConfigService,
  ) {
    this.logger.log('UserController init!');
  }

  @Get()
  getUsers() {
    // const data = this.configService.get(ConfigEnum.DB_DATABASE);
    // console.log('data: ', data); // testdb

    const user = { isAdmin: false };
    if (!user.isAdmin) {
      throw new UnauthorizedException('用户未授权');
      // throw new NotFoundException('用户不存在');
      // throw new HttpException(
      //   'User is not admin, Forbidden to access getAllUsers',
      //   HttpStatus.FORBIDDEN,
      // );
    }

    this.logger.log('请求 getUsers 成功');
    this.logger.warn('请求 getUsers 成功');
    this.logger.error('请求 getUsers 成功');
    // this.logger.debug('请求 getUsers 成功');
    // this.logger.verbose('请求 getUsers 成功');

    return this.userService.findAll();
  }

  @Get('name')
  getUserByName() {
    return this.userService.find('admin');
  }

  @Post()
  addUser(): any {
    const user = {
      username: 'test1',
      password: '123456',
    } as User;
    return this.userService.create(user);
  }

  @Patch()
  updateUser(): any {
    const updateUser = { username: '张三' } as User;
    return this.userService.update(2, updateUser);
  }

  @Delete()
  removeUser(): any {
    return this.userService.delete(2);
  }

  @Get('/profile')
  getUserProfile(): any {
    return this.userService.findProfile(1);
  }

  @Get('/logs')
  getUserLogs(): any {
    return this.userService.findUserLogs(2);
  }

  @Get('/logsByGroup')
  async getLogsByGroup(): Promise<any> {
    const res = await this.userService.findLogsByGroup(2);
    // 过滤 显示 需要的数据
    return res.map((o) => ({
      result: o.result,
      count: o.count,
    }));
  }
}
