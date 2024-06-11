import {Database} from '@core/config/database/database.model';
import {Injectable} from '@nestjs/common';
import {DatabaseRepository} from '@shared/repositories/database.repository';

@Injectable()
export class DivisionRepository extends DatabaseRepository {
  constructor(database: Database) {
    super(database);
  }

  async createDivision(collectionName: string, userParam: any) {
    return this.insertSingle(collectionName, userParam);
  }

  async getDivisions(collectionName: string, columnsAndValues: any) {
    return this.selectWithAnd(collectionName, columnsAndValues);
  }

  async getDivision(collectionName: string, columnsAndValues: any) {
    return this.selectWithAndOne(collectionName, columnsAndValues);
  }

  async updateDivision(collectionName: string, columnsAndValues: any, targetColumnsAndValues: any) {
    return this.updateSingle(collectionName, columnsAndValues, targetColumnsAndValues);
  }

  async deleteDivision(collectionName: string, targetColumnsAndValues: any) {
    return this.deleteOne(collectionName, targetColumnsAndValues);
  }
}
