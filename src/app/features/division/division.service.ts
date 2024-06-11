import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateDivisionDto} from './dto/create-division.dto';
import {UpdateDivisionDto} from './dto/update-division.dto';
import {DivisionRepository} from './repository/division.repository';
import {UtilService} from '@shared/services/util.service';
import {SchemaConstants} from '@core/constants/schema-constants';
import {UniqueIdConstants} from '@core/constants/unique-id-constants';

@Injectable()
export class DivisionService {
  constructor(private readonly divisionRepository: DivisionRepository, private readonly utilService: UtilService) {}

  async create(createDivisionDto: CreateDivisionDto) {
    await this.findDuplicateThrow(SchemaConstants.DIVISION, {
      divisionName: createDivisionDto.divisionName,
    });

    const divisionId = await this.utilService.generateUniqueId(UniqueIdConstants.DIVISION);

    createDivisionDto.divisionId = divisionId;
    createDivisionDto.createdAt = new Date();
    createDivisionDto.updatedAt = new Date();
    createDivisionDto.status = 'Active';

    await this.divisionRepository.createDivision(SchemaConstants.DIVISION, createDivisionDto);

    return 'Division created successfully';
  }

  async findAll() {
    return this.divisionRepository.getDivisions(SchemaConstants.DIVISION, {});
  }

  async findOne(id: string) {
    return this.findOrThrow(SchemaConstants.DIVISION, {divisionId: id});
  }

  async update(id: string, updateDivisionDto: UpdateDivisionDto) {
    await this.findOrThrow(SchemaConstants.DIVISION, {divisionId: id});

    await this.divisionRepository.updateDivision(SchemaConstants.DIVISION, updateDivisionDto, {divisionId: id});

    return 'Division updated successfully';
  }

  async remove(id: string) {
    await this.findOrThrow(SchemaConstants.DIVISION, {divisionId: id});

    await this.divisionRepository.deleteDivision(SchemaConstants.DIVISION, {divisionId: id});

    return `Division deleted successfully`;
  }

  async findOrThrow(collectionName: string, columnsAndValues: any) {
    const division = await this.divisionRepository.getDivision(collectionName, columnsAndValues);

    if (!division) throw new NotFoundException(`Cannot find ${collectionName}`);

    return division;
  }

  async findDuplicateThrow(collectionName: string, columnsAndValues: any) {
    const duplicate = await this.divisionRepository.getDivision(collectionName, columnsAndValues);

    if (duplicate) {
      const duplicateValueString = Object.entries(columnsAndValues)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');

      throw new ConflictException(`Duplicate ${collectionName} ${duplicateValueString}`);
    }

    return duplicate;
  }
}
