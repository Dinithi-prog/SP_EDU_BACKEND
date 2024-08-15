import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateAttendanceDto} from './dto/create-attendance.dto';
import {UpdateAttendanceDto} from './dto/update-attendance.dto';
import {UtilService} from '@shared/services/util.service';
import {AttendanceRepository} from './repository/attendance.repository';
import {SchemaConstants} from '@core/constants/schema-constants';

@Injectable()
export class AttendanceService {
  constructor(private readonly attendanceRepository: AttendanceRepository, private readonly utilService: UtilService) {}
  async create(createAttendanceDto: CreateAttendanceDto, userId: string) {
    const clockIn = await this.getAttendanceByDate(userId);

    const _id = clockIn?._id;

    if (clockIn && createAttendanceDto.type === 'clockIn') throw new BadRequestException(`You have already clocked In`);

    createAttendanceDto.userId = userId;
    createAttendanceDto.createdAt = new Date();

    if (!clockIn) {
      createAttendanceDto.clockIn = new Date();
      return this.attendanceRepository.createAttendance(SchemaConstants.ATTENDANCE, createAttendanceDto);
    } else {
      if (clockIn && clockIn.clockOut) throw new BadRequestException(`You have already clocked Out`);
      createAttendanceDto.clockOut = new Date();
      return this.attendanceRepository.updateAttendance(SchemaConstants.ATTENDANCE, createAttendanceDto, {_id: _id});
    }
  }

  async findAll(userId: string) {
    const attendance = await this.attendanceRepository.getAttendances(SchemaConstants.ATTENDANCE, {userId: userId});

    const transformedAttendance = attendance?.map(record => {
      const createdAt = new Date(record.createdAt).toISOString().split('T')[0];

      const clockIn = new Date(record.clockIn).toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Colombo',
        hour12: false,
      });

      const clockOut = new Date(record.clockOut).toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Colombo',
        hour12: false,
      });

      return {
        createdAt: createdAt,
        clockIn: clockIn,
        clockOut: record.clockOut ? clockOut : null,
      };
    });

    return transformedAttendance;
  }

  async findAllAttendance() {
    const joinArr = [
      {
        // Lookup to get the user details
        $lookup: {
          from: 'user',
          localField: 'userId',
          foreignField: 'userId',
          as: 'userDetails',
        },
      },
      {
        // Unwind the userDetails array to merge the user details with the main data
        $unwind: '$userDetails',
      },
      {
        // Lookup to get the division details
        $lookup: {
          from: 'division',
          localField: 'userDetails.divisionName',
          foreignField: 'divisionName',
          as: 'divisionDetails',
        },
      },
      {
        // Unwind the divisionDetails array
        $unwind: {
          path: '$divisionDetails',
          preserveNullAndEmptyArrays: true, // Allows users without division details to be included
        },
      },
      {
        // Lookup to get the department details
        $lookup: {
          from: 'department',
          localField: 'divisionDetails.departmentName',
          foreignField: 'departmentName',
          as: 'departmentDetails',
        },
      },
      {
        // Unwind the departmentDetails array
        $unwind: {
          path: '$departmentDetails',
          preserveNullAndEmptyArrays: true, // Allows users without department details to be included
        },
      },
      {
        // Lookup to count the approved leaves taken by the user
        $lookup: {
          from: 'leave',
          let: {userId: '$userId'},
          pipeline: [
            {$match: {$expr: {$and: [{$eq: ['$userId', '$$userId']}, {$eq: ['$status', 'approved']}]}}},
            {$count: 'leaveCount'},
          ],
          as: 'leaveDetails',
        },
      },
      {
        // Add a field for leave count with default value 0 if no approved leaves are found
        $addFields: {
          leaveTaken: {
            $cond: {
              if: {$gt: [{$size: '$leaveDetails'}, 0]},
              then: {$arrayElemAt: ['$leaveDetails.leaveCount', 0]},
              else: 0,
            },
          },
        },
      },
      {
        // Group by userId to ensure unique users
        $group: {
          _id: '$userId',
          fullName: {$first: {$concat: ['$userDetails.firstName', ' ', '$userDetails.lastName']}},
          divisionName: {$first: '$divisionDetails.divisionName'},
          departmentName: {$first: '$departmentDetails.departmentName'},
          leaveTaken: {$first: '$leaveTaken'},
        },
      },
      {
        // Project the required fields including userId
        $project: {
          _id: 0,
          userId: '$_id',
          fullName: 1,
          divisionName: 1,
          departmentName: 1,
          leaveTaken: 1,
        },
      },
    ];
    return this.attendanceRepository.getJoinWithAnd(SchemaConstants.ATTENDANCE, joinArr);
  }

  findOne(id: string) {
    return `This action returns a #${id} attendance`;
  }

  getAttendanceByDate(userId: string) {
    const currentDate = new Date().toISOString().split('T')[0];
    const startOfDay = new Date(currentDate + 'T00:00:00.000Z');
    const endOfDay = new Date(currentDate + 'T23:59:59.999Z');

    const filter = {
      userId: userId,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    };
    return this.attendanceRepository.getAttendance(SchemaConstants.ATTENDANCE, filter);
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
