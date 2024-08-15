import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {LeaveManagementService} from './leave-management.service';
import {CreateLeaveManagementDto} from './dto/create-leave-management.dto';
import {UpdateLeaveManagementDto} from './dto/update-leave-management.dto';
import {LeaveStatus, RequestLeaveDto} from './dto/request-leave.dto';
import {User} from '@core/decorators/user.decorator';
import {Public} from '@core/decorators/public.decorator';

@Controller('leave')
export class LeaveManagementController {
  constructor(private readonly leaveManagementService: LeaveManagementService) {}

  @Post()
  create(@Body() requestLeaveDto: RequestLeaveDto, @User() user: any) {
    return this.leaveManagementService.create(requestLeaveDto, user.userId);
  }

  @Get()
  findAll() {
    return this.leaveManagementService.findAll();
  }

  @Get('user')
  findAllToUser(@User() user: any) {
    return this.leaveManagementService.findAllToUser(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveManagementService.findOne(id);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: LeaveStatus) {
    return this.leaveManagementService.findByStatus(status);
  }

  @Patch(':id/:status')
  updateLeaveStatus(@Param('id') id: string, @Param('status') status: LeaveStatus) {
    return this.leaveManagementService.updateLeaveStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaveManagementService.remove(+id);
  }
}
