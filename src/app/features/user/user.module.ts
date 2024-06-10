import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { UtilService } from '@shared/services/util.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, UtilService],
})
export class UserModule {}
