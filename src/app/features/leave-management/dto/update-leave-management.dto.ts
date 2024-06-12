import { PartialType } from '@nestjs/swagger';
import { CreateLeaveManagementDto } from './create-leave-management.dto';

export class UpdateLeaveManagementDto extends PartialType(CreateLeaveManagementDto) {}
