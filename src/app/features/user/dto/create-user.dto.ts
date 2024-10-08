import {PickType} from '@nestjs/swagger';
import {User} from '../entity/user.entity';

export class CreateUserDto extends PickType(User, [
  'firstName',
  'lastName',
  'email',
  'password',
  'userRole',
  'mobileNumber',
  'alternativeNumber',
  'currentAddress',
  'permanentAddress',
  'nic',
  'dob',
  'gender',
  'maritalStatus',
  'departmentName',
  'divisionName',
  'userId',
  'createAt',
  'updatedAt',
  'status',
] as const) {}
