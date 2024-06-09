import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Type } from 'class-transformer';

export class User{
    
    userId: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    userRole: string;

    @IsNotEmpty()
    @IsString()
    mobileNumber: string;

    @IsNotEmpty()
    @IsString()
    alternativeNumber: string;

    @IsNotEmpty()
    @IsString()
    currentAddress: string;

    @IsNotEmpty()
    @IsString()
    permenantAddress: string;

    @IsNotEmpty()
    @IsString()
    nic: string;

    @IsNotEmpty()
    @IsString()
    dob: string;

    @IsNotEmpty()
    @IsString()
    gender:string;

    @IsNotEmpty()
    @IsString()
    maritalStatus: string;

    @IsNotEmpty()
    @IsString()
    departmentId: string;

    @IsNotEmpty()
    @IsString()
    divisionId: string;

    @IsNotEmpty()
    @IsString()
    status: string;

    
    createAt: Date;

    
    updatedAt: Date;
    
  
    deletedAt?: Date;
}