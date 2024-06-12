import {Module} from '@nestjs/common';
import {AttendanceService} from './attendance.service';
import {AttendanceController} from './attendance.controller';
import {UtilService} from '@shared/services/util.service';
import {AttendanceRepository} from './repository/attendance.repository';

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService, UtilService, AttendanceRepository],
})
export class AttendanceModule {}
