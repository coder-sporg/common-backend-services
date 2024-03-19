import {
  Body,
  Controller,
  Delete,
  Get,
  // Headers,
  Inject,
  // HttpException,
  // HttpStatus,
  LoggerService,
  Param,
  ParseIntPipe,
  // NotFoundException,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { ConfigEnum } from 'src/enum/config.enum';
import { UserService } from './user.service';
import { User } from './user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getUserDto } from './dto/get-user.dto';
import { TypeormFilter } from '../filters/typeorm.filter';
import { CreateUserPipe } from './pipes/create-user.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

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
  getUser(@Param('id') id: number) {
    return this.userService.findOne(id);
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
  getUserByName(@Query('name') name: string) {
    return this.userService.find(name);
  }

  @Post()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addUser(@Body(CreateUserPipe) dto: CreateUserDto, @Req() req: any): any {
    // 拿到所有 请求的信息
    // console.log('🚀 ~ UserController ~ addUser ~ req:', req);
    const user = dto as User;
    return this.userService.create(user);
  }

  @Patch('/:id')
  // param 可能有多个，需要保持 命名与 传入的一致，即 patch中与param一致
  // DTO 数据传输格式
  updateUser(
    @Body() dto: any,
    @Param('id') id: number,
    // @Headers('Authorization') headers: any,
  ): any {
    const updateUser = dto as User;
    return this.userService.update(id, updateUser);

    // if (id === headers) {
    //   // 说明是同一个用户在修改
    //   // todo
    //   // 权限1：判断用户是否是自己
    //   // 权限2：判断用户是否有更新user的权限
    //   // 返回数据：不能包含敏感的password等信息
    //   const updateUser = dto as User;
    //   return this.userService.update(id, updateUser);
    // } else {
    //   throw new UnauthorizedException();
    // }
  }

  // 1.controller名 vs service名 vs repository名应该怎么取
  // 2.typeorm里面delete 与 remove的区别
  @Delete('/:id')
  removeUser(@Param('id') id: number): any {
    // 权限：判断用户是否有删除user的权限
    return this.userService.remove(id);
  }

  @Get('/profile')
  @UseGuards(AuthGuard('jwt')) // 鉴权，headers 是否携带token
  // 将 id 解析出来
  getUserProfile(@Query('id', ParseIntPipe) id: any): any {
    // console.log('id: ', id, typeof id); // number
    return this.userService.findProfile(id);
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
