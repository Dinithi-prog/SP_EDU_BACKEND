import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {ApiConstants} from '@core/constants/api-constants';
import {ApiTags} from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller(ApiConstants.USER)
@ApiTags(ApiConstants.USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {   
    return this.userService.create(createUserDto);
    
  }

  @Get()
  findAll() {
    console.log("test");
    
  }

  @Post('/role')
  createUserRole(@Body() createRoleDto: CreateRoleDto){
    return this.userService.createUserRole(createRoleDto);
    
  }
  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

}
