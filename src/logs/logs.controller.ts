import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('logs')
@UseGuards(JwtGuard)
export class LogsController {
  @Get()
  getTest() {
    return 'logs test!!!!';
  }
}
