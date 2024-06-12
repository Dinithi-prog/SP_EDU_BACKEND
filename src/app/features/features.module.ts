import {Module} from '@nestjs/common';
import {UserModule} from './user/user.module';
import {DepartmentModule} from './department/department.module';
import { DivisionModule } from './division/division.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeaveManagementModule } from './leave-management/leave-management.module';

@Module({
  imports: [UserModule, DepartmentModule, DivisionModule, AttendanceModule, LeaveManagementModule],
})
export class FeaturesModule {}
