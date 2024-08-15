import {Module} from '@nestjs/common';
import {LeaveManagementService} from './leave-management.service';
import {LeaveManagementController} from './leave-management.controller';
import {LeaveManagementRepository} from './repository/leave-management.repository';
import {UtilService} from '@shared/services/util.service';

@Module({
  controllers: [LeaveManagementController],
  providers: [LeaveManagementService, LeaveManagementRepository, UtilService],
})
export class LeaveManagementModule {}
