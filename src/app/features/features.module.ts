import {Module} from '@nestjs/common';
import {UserModule} from './user/user.module';
import {DepartmentModule} from './department/department.module';
import { DivisionModule } from './division/division.module';

@Module({
  imports: [UserModule, DepartmentModule, DivisionModule],
})
export class FeaturesModule {}
