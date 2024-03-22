import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
// import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { Serialize } from '../decorators/serialize.decorator';
import { CaslGuard } from '../guards/casl.guard';
import { Can, CheckPolicies } from '../decorators/casl.decorator';
import { Logs } from './logs.entity';
import { Action } from '../enum/action.enum';

class LogsDto {
  @IsString()
  @IsNotEmpty()
  msg: string;

  @IsString() // 此处如果没有写，不会接收id
  id: string;

  @IsString()
  name: string;
}

class PublicLogsDto {
  @Expose()
  msg: string;

  @Expose()
  name: string;
}

@Controller('logs')
// @UseGuards(JwtGuard)
@UseGuards(JwtGuard, CaslGuard)
@CheckPolicies((ability) => ability.can(Action.Read, Logs))
@Can(Action.Read, Logs)
export class LogsController {
  @Get()
  @Can(Action.Read, Logs)
  getTest() {
    return 'logs test!!!!';
  }

  @Post()
  @Serialize(PublicLogsDto)
  @Can(Action.Create, Logs)
  // @UseInterceptors(new SerializeInterceptor(PublicLogsDto)) // 可以简化为一个 装饰器
  postTest(@Body() dto: LogsDto) {
    console.log('dto: ', dto); // main.ts 中 whiteList 设为 true，此处严格按照 Dto 格式
    return dto;
  }
}
