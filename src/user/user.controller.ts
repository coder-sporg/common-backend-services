import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  // HttpException,
  // HttpStatus,
  LoggerService,
  Param,
  // NotFoundException,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { ConfigEnum } from 'src/enum/config.enum';
import { UserService } from './user.service';
import { User } from './user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getUserDto } from './dto/get-user.dto';
import { TypeormFilter } from '../filters/typeorm.filter';

@Controller('user')
@UseFilters(new TypeormFilter())
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    // private configService: ConfigService,
  ) {
    this.logger.log('UserController init!');
  }

  @Get('/info/:id')
  getUser() {
    return 'getUser';
  }

  @Get()
  // 前端传递的所有参数都是 string
  getUsers(@Query() query: getUserDto) {
    // const data = this.configService.get(ConfigEnum.DB_DATABASE);
    // console.log('data: ', data); // testdb

    const user = { isAdmin: true };
    if (!user.isAdmin) {
      throw new UnauthorizedException('用户未授权');
      // throw new NotFoundException('用户不存在');
      // throw new HttpException(
      //   'User is not admin, Forbidden to access getAllUsers',
      //   HttpStatus.FORBIDDEN,
      // );
    }

    // this.logger.log('请求 getUsers 成功');
    // this.logger.warn('请求 getUsers 成功');
    // this.logger.error('请求 getUsers 成功');
    // this.logger.debug('请求 getUsers 成功');
    // this.logger.verbose('请求 getUsers 成功');

    // page 页码 limit 每页条数 condition 查询条件（username, role, gender） 排序 sort
    return this.userService.findAll(query);
  }

  @Get('name')
  getUserByName() {
    return this.userService.find('admin');
  }

  @Post()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addUser(@Body() dto: any, @Req() req: any): any {
    // 拿到所有 请求的信息
    // console.log('🚀 ~ UserController ~ addUser ~ req:', req);
    const user = dto as User;
    return this.userService.create(user);
  }

  @Patch('/:id')
  // param 可能有多个，需要保持 命名与 传入的一致，即 patch中与param一致
  // DTO 数据传输格式
  updateUser(@Body() dto: any, @Param('id') id: number): any {
    const updateUser = dto as User;
    return this.userService.update(id, updateUser);
  }

  // 1.controller名 vs service名 vs repository名应该怎么取
  // 2.typeorm里面delete 与 remove的区别
  @Delete('/:id')
  removeUser(@Param('id') id: number): any {
    return this.userService.remove(id);
  }

  @Get('/profile')
  // 将 id 解析出来
  getUserProfile(@Query('id') query: any): any {
    return this.userService.findProfile(query);
  }

  // todo 放入 logs 中
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
