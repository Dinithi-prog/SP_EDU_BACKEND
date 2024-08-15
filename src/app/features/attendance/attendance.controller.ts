import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {AttendanceService} from './attendance.service';
import {CreateAttendanceDto} from './dto/create-attendance.dto';
import {UpdateAttendanceDto} from './dto/update-attendance.dto';
import {User} from '@core/decorators/user.decorator';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto, @User() user: any) {
    return this.attendanceService.create(createAttendanceDto, user.userId);
  }

  @Get()
  findAll(@User() user: any) {
    return this.attendanceService.findAll(user.userId);
  }

  @Get('all')
  findAllAttendance() {
    return this.attendanceService.findAllAttendance();
  }

  @Get('/by-date')
  getAttendanceByDate(@User() user: any) {
    return this.attendanceService.getAttendanceByDate(user.userId);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}
