import {Controller, Get, Post, Body, Patch, Param, Delete, UsePipes} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {ApiConstants} from '@core/constants/api-constants';
import {ApiTags} from '@nestjs/swagger';
import {CreateRoleDto} from './dto/create-role.dto';
import {UniqueIdValidationPipe} from '@shared/pipes/unique-id-validation.pipe';
import {UserLoginDto} from './dto/login-user.dto';
import {Public} from '@core/decorators/public.decorator';

@Controller(ApiConstants.USER)
@ApiTags(ApiConstants.USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  @Public()
  login(@Body() userLoginDto: UserLoginDto) {
    return this.userService.loginUser(userLoginDto);
  }

  @Post('/role')
  createUserRole(@Body() createRoleDto: CreateRoleDto) {
    return this.userService.createUserRole(createRoleDto);
  }

  @Get()
  @Public()
  findAllUser() {
    return this.userService.findAllUser();
  }

  @Get('/role')
  findAllUserRole() {
    return this.userService.findAllUserRole();
  }

  @Get(':id')
  @UsePipes()
  findOneUser(@Param('id', UniqueIdValidationPipe) id: string) {
    return this.userService.findOneUser(id);
  }

  @Patch(':id')
  @UsePipes()
  updateUser(@Param('id', UniqueIdValidationPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Public()
  @UsePipes()
  deleteUser(@Param('id', UniqueIdValidationPipe) id: string) {
    return this.userService.deleteUser(id);
  }
}
