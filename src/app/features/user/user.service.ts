import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import { UserRepository } from './repository/user.repository';
import { SchemaConstants } from '@core/constants/schema-constants';

@Injectable()
export class UserService {
  constructor(private readonly userRepository:UserRepository){
  }
  create(createUserDto: CreateUserDto) {
    createUserDto.userId="1234"
    createUserDto.createAt= new Date()
    createUserDto.updatedAt= new Date()
    
  return this.userRepository.createUser(SchemaConstants.USER,createUserDto)
  }

  findAll() {
    return `This action returns all user`;
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
