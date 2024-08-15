import {Type} from 'class-transformer';
import {IsEnum, IsOptional, IsString, IsDate, IsNotEmpty} from 'class-validator';

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export class RequestLeaveDto {
  userId: string;

  leaveId: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  from: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  to: Date;

  @IsNotEmpty()
  @IsString()
  leaveType: string;

  @IsOptional()
  @IsString()
  reason: string;

  @IsOptional()
  @IsEnum(LeaveStatus)
  status: LeaveStatus = LeaveStatus.PENDING;

  @IsOptional()
  @IsDate()
  createdAt: Date = new Date();

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}
