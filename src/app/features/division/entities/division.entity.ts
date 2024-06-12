import {IsString, IsNotEmpty, IsOptional} from 'class-validator';
export class Division {
  divisionId: string;

  @IsNotEmpty()
  @IsString()
  divisionName: string;

  @IsNotEmpty()
  departmentName: number;

  @IsOptional()
  @IsString()
  description?: string;

  status?: string;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;
}
