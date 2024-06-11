import {Module} from '@nestjs/common';
import {DivisionService} from './division.service';
import {DivisionController} from './division.controller';
import {DivisionRepository} from './repository/division.repository';
import {UtilService} from '@shared/services/util.service';

@Module({
  controllers: [DivisionController],
  providers: [DivisionService, DivisionRepository, UtilService],
})
export class DivisionModule {}
