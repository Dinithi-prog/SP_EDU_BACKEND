import {Database} from '@core/config/database/database.model';
import {Injectable} from '@nestjs/common';
import {DatabaseRepository} from '@shared/repositories/database.repository';

@Injectable()
export class LeaveManagementRepository extends DatabaseRepository {
  constructor(database: Database) {
    super(database);
  }

  async create(collectionName: string, userParam: any) {
    return this.insertSingle(collectionName, userParam);
  }

  async getAll(collectionName: string, columnsAndValues: any) {
    return this.selectWithAnd(collectionName, columnsAndValues);
  }

  async getByOne(collectionName: string, columnsAndValues: any) {
    return this.selectWithAndOne(collectionName, columnsAndValues);
  }

  async update(collectionName: string, columnsAndValues: any, targetColumnsAndValues: any) {
    return this.updateSingle(collectionName, columnsAndValues, targetColumnsAndValues);
  }

  async delete(collectionName: string, targetColumnsAndValues: any) {
    return this.deleteOne(collectionName, targetColumnsAndValues);
  }

  async getJoinWithAnd(collectionName: string, joinArr: any[]) {
    return this.joinWithAnd(collectionName, joinArr);
  }
}
