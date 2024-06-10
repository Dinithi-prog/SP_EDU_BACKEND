import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import { UserRepository } from './repository/user.repository';
import { SchemaConstants } from '@core/constants/schema-constants';
import { UtilService } from '@shared/services/util.service';
import { UniqueIdConstants } from '@core/constants/unique-id-constants';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository:UserRepository, private readonly utilService:UtilService){
  }
  create(createUserDto: CreateUserDto) {
    const userId = this.utilService.generateUniqueId(UniqueIdConstants.USER)
    createUserDto.userId= userId
    createUserDto.createAt= new Date()
    createUserDto.updatedAt= new Date()
    
  return this.userRepository.createUser(SchemaConstants.USER,createUserDto)
  }

  findAll() {
    return `This action returns all user`;
  }
 
  createUserRole(createRoleDto: CreateRoleDto){
    const roleId = this.utilService.generateUniqueId(UniqueIdConstants.ROLE)
    createRoleDto.roleId = roleId
    createRoleDto.createdAt= new Date()
    createRoleDto.updatedAt= new Date()

    return this.userRepository.createRole(SchemaConstants.ROLE,createRoleDto)
  }
  
  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
