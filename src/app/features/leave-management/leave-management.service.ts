import {LeaveManagement} from './entities/leave-management.entity';
import {Injectable} from '@nestjs/common';
import {CreateLeaveManagementDto} from './dto/create-leave-management.dto';
import {UpdateLeaveManagementDto} from './dto/update-leave-management.dto';
import {LeaveStatus, RequestLeaveDto} from './dto/request-leave.dto';
import {LeaveManagementRepository} from './repository/leave-management.repository';
import {UtilService} from '@shared/services/util.service';
import {SchemaConstants} from '@core/constants/schema-constants';
import {UniqueIdConstants} from '@core/constants/unique-id-constants';

@Injectable()
export class LeaveManagementService {
  constructor(
    private readonly leaveManagementRepository: LeaveManagementRepository,
    private readonly utilService: UtilService,
  ) {}

  create(requestLeaveDto: RequestLeaveDto, userId: string) {
    requestLeaveDto.userId = userId;
    requestLeaveDto.status = LeaveStatus.PENDING;
    requestLeaveDto.leaveId = this.utilService.generateUniqueId(UniqueIdConstants.LEAVE);

    return this.leaveManagementRepository.create(SchemaConstants.LEAVE, requestLeaveDto);
  }

  async findAll() {
    const allLeave = await this.leaveManagementRepository.getAll(SchemaConstants.LEAVE, {});

    const convertedLeaves = allLeave?.map(leave => {
      return {
        ...leave,
        createdAt: this.utilService.convertDateTimeUtcToLocal(leave.createdAt),
        from: this.utilService.convertDateUtcToLocal(leave.from),
        to: this.utilService.convertDateUtcToLocal(leave.to),
      };
    });

    return convertedLeaves;
  }

  async findAllToUser(userId: string) {
    const allLeave = await this.leaveManagementRepository.getAll(SchemaConstants.LEAVE, {userId: userId});

    const convertedLeaves = allLeave?.map(leave => {
      return {
        ...leave,
        createdAt: this.utilService.convertDateTimeUtcToLocal(leave.createdAt),
        from: this.utilService.convertDateUtcToLocal(leave.from),
        to: this.utilService.convertDateUtcToLocal(leave.to),
      };
    });

    return convertedLeaves;
  }

  async findByStatus(status: LeaveStatus) {
    const joinArray = [
      {
        // Filter by leave status, e.g., 'approved'
        $match: {
          status: status,
        },
      },
      {
        // Lookup to join with the user collection
        $lookup: {
          from: 'user',
          localField: 'userId',
          foreignField: 'userId',
          as: 'userDetails',
        },
      },
      {
        // Unwind the userDetails array
        $unwind: '$userDetails',
      },
      {
        // Lookup to join with the division collection
        $lookup: {
          from: 'division',
          localField: 'userDetails.divisionName',
          foreignField: 'divisionName',
          as: 'divisionDetails',
        },
      },
      {
        // Unwind the divisionDetails array
        $unwind: '$divisionDetails',
      },
      {
        // Project the required fields
        $project: {
          _id: 0,
          userId: '$userId',
          name: {$concat: ['$userDetails.firstName', ' ', '$userDetails.lastName']},
          divisionName: '$divisionDetails.divisionName',
          leaveDate: '$createdAt',
          leaveType: '$leaveType',
          reason: '$reason',
          status: '$status',
        },
      },
    ];

    const allLeave = await this.leaveManagementRepository.getJoinWithAnd(SchemaConstants.LEAVE, joinArray);

    const convertedLeaves = allLeave?.map(leave => {
      return {
        ...leave,
        leaveDate: this.utilService.convertDateTimeUtcToLocal(leave.leaveDate),
      };
    });

    return convertedLeaves;
  }

  async findOne(id: string) {
    const leave = await this.leaveManagementRepository.getByOne(SchemaConstants.LEAVE, {leaveId: id});

    const convertedLeave = {
      ...leave,
      createdAt: this.utilService.convertDateTimeUtcToLocal(leave?.createdAt),
      from: this.utilService.convertDateUtcToLocal(leave?.from),
      to: this.utilService.convertDateUtcToLocal(leave?.to),
    };

    return convertedLeave;
  }

  updateLeaveStatus(id: string, status: LeaveStatus) {
    this.leaveManagementRepository.update(SchemaConstants.LEAVE, {status: status}, {leaveId: id});

    return `Successfully Updated leave status`;
  }

  remove(id: number) {
    return `This action removes a #${id} leaveManagement`;
  }
}
