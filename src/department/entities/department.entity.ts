import { IsNotEmpty, IsString } from "class-validator";

export class Department {

    departmentId: string;

    
    @IsNotEmpty()
    @IsString()
    departmentName: string;



}
