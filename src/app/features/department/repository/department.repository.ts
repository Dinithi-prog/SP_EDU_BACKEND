import {Database} from '@core/config/database/database.model';
import {Injectable} from '@nestjs/common';
import {DatabaseRepository} from '@shared/repositories/database.repository';

@Injectable()
export class DepartmentRepository extends DatabaseRepository {
  constructor(database: Database) {
    super(database);
  }

  async createDepartment(collectionName: string, columnsAndValues: any) {
    return this.insertSingle(collectionName, columnsAndValues);
  }

  async getDepartments(collectionName: string, columnsAndValues: any) {
    return this.selectWithAnd(collectionName, columnsAndValues);
  }

  async getDepartment(collectionName: string, columnsAndValues: any) {
    return this.selectWithAndOne(collectionName, columnsAndValues);
  }

  async updateDepartment(collectionName: string, columnsAndValues: any, targetColumnsAndValues: any) {
    return this.updateSingle(collectionName, columnsAndValues, targetColumnsAndValues);
  }

  async deleteDepartment(collectionName: string, targetColumnsAndValues: any) {
    return this.deleteOne(collectionName, targetColumnsAndValues);
  }
}
