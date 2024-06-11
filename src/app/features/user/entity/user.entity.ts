import {IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, Length} from 'class-validator';
import {Type} from 'class-transformer';

export class User {
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 25)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 25)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(8, 100)
  email: string;

  password: string;

  @IsNotEmpty()
  @IsString()
  userRole: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  mobileNumber: string;

  @IsOptional()
  @IsString()
  alternativeNumber: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  currentAddress: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  permanentAddress: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 12)
  nic: string;

  @IsNotEmpty()
  @IsString()
  dob: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  maritalStatus: string;

  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @IsNotEmpty()
  @IsString()
  divisionId: string;

  status: string;

  createAt: Date;

  updatedAt: Date;

  deletedAt?: Date;
}
