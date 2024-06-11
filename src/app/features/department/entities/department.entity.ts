import {IsNotEmpty, IsOptional, IsString, Length} from 'class-validator';

export class Department {
  departmentId: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 25)
  departmentName: string;

  @IsOptional()
  @IsString()
  description: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
