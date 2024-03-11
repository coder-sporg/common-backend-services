import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RolesModule } from './roles/roles.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [UserModule, RolesModule, LogsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
