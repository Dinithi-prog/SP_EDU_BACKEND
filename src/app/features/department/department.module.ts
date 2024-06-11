import {Module} from '@nestjs/common';
import {DepartmentService} from './department.service';
import {DepartmentController} from './department.controller';
import {DepartmentRepository} from './repository/department.repository';
import {UtilService} from '@shared/services/util.service';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService, DepartmentRepository, UtilService],
})
export class DepartmentModule {}
