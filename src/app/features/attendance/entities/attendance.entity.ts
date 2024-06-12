import {IsDate, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {Type} from 'class-transformer';

export class Attendance {
  attendanceId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  clockIn: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  clockOut: Date;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
