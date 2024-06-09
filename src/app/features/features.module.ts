import {Module} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [UserModule, AttendanceModule],
})
export class FeaturesModule {}
