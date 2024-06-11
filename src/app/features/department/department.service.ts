import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateDepartmentDto} from './dto/create-department.dto';
import {UpdateDepartmentDto} from './dto/update-department.dto';
import {DepartmentRepository} from './repository/department.repository';
import {SchemaConstants} from '@core/constants/schema-constants';
import {UtilService} from '@shared/services/util.service';
import {UniqueIdConstants} from '@core/constants/unique-id-constants';

@Injectable()
export class DepartmentService {
  constructor(private readonly departmentRepository: DepartmentRepository, private readonly utilService: UtilService) {}
  async create(createDepartmentDto: CreateDepartmentDto) {
    const departmentId = this.utilService.generateUniqueId(UniqueIdConstants.DEPARTMENT);

    createDepartmentDto.departmentId = departmentId;

    createDepartmentDto.createdAt = new Date();
    createDepartmentDto.updatedAt = new Date();

    await this.findDuplicateThrow(SchemaConstants.DEPARTMENT, {departmentName: createDepartmentDto.departmentName});

    await this.departmentRepository.createDepartment(SchemaConstants.DEPARTMENT, createDepartmentDto);

    return 'Department created successfully';
  }

  findAll() {
    return this.departmentRepository.getDepartments(SchemaConstants.DEPARTMENT, {});
  }

  async findOne(id: string) {
    await this.findOrThrow(SchemaConstants.DEPARTMENT, {departmentId: id});

    return this.departmentRepository.getDepartment(SchemaConstants.DEPARTMENT, {departmentId: id});
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    await this.findOrThrow(SchemaConstants.DEPARTMENT, {departmentId: id});

    await this.departmentRepository.updateDepartment(SchemaConstants.DEPARTMENT, updateDepartmentDto, {
      departmentId: id,
    });

    return 'Department updated successfully';
  }

  async remove(id: string) {
    await this.findOrThrow(SchemaConstants.DEPARTMENT, {departmentId: id});

    this.departmentRepository.deleteDepartment(SchemaConstants.DEPARTMENT, {departmentId: id});

    return 'Department deleted successfully';
  }

  async findOrThrow(collectionName: string, columnsAndValues: any) {
    const department = await this.departmentRepository.getDepartment(collectionName, columnsAndValues);

    if (!department) throw new NotFoundException(`Cannot find ${collectionName}`);

    return department;
  }

  async findDuplicateThrow(collectionName: string, columnsAndValues: any) {
    const duplicate = await this.departmentRepository.getDepartment(collectionName, columnsAndValues);

    if (duplicate) {
      const duplicateValueString = Object.entries(columnsAndValues)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');

      throw new ConflictException(`Duplicate ${collectionName} ${duplicateValueString}`);
    }

    return duplicate;
  }
}
