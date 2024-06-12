import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateAttendanceDto} from './dto/create-attendance.dto';
import {UpdateAttendanceDto} from './dto/update-attendance.dto';
import {UtilService} from '@shared/services/util.service';
import {AttendanceRepository} from './repository/attendance.repository';
import {SchemaConstants} from '@core/constants/schema-constants';

@Injectable()
export class AttendanceService {
  constructor(private readonly attendanceRepository: AttendanceRepository, private readonly utilService: UtilService) {}
  create(createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceRepository.createAttendance(SchemaConstants.ATTENDANCE, createAttendanceDto);
  }

  findAll() {
    return this.attendanceRepository.getAttendances(SchemaConstants.ATTENDANCE, {});
  }

  findOne(id: string) {
    return `This action returns a #${id} attendance`;
  }

  update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    return `This action updates a #${id} attendance`;
  }

  remove(id: string) {
    return `This action removes a #${id} attendance`;
  }

  async findOrThrow(collectionName: string, columnsAndValues: any) {
    const attendance = await this.attendanceRepository.getAttendance(collectionName, columnsAndValues);

    if (!attendance) throw new NotFoundException(`Cannot find ${collectionName}`);

    return attendance;
  }

  async findDuplicateThrow(collectionName: string, columnsAndValues: any) {
    const duplicate = await this.attendanceRepository.getAttendance(collectionName, columnsAndValues);

    if (duplicate) {
      const duplicateValueString = Object.entries(columnsAndValues)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');

      throw new ConflictException(`Duplicate ${collectionName} ${duplicateValueString}`);
    }

    return duplicate;
  }
}
