import {Database} from '@core/config/database/database.model';
import {Injectable} from '@nestjs/common';
import {DatabaseRepository} from '@shared/repositories/database.repository';

@Injectable()
export class AttendanceRepository extends DatabaseRepository {
  constructor(database: Database) {
    super(database);
  }

  async createAttendance(collectionName: string, userParam: any) {
    return this.insertSingle(collectionName, userParam);
  }

  async getAttendances(collectionName: string, columnsAndValues: any) {
    return this.selectWithAnd(collectionName, columnsAndValues);
  }

  async getAttendance(collectionName: string, columnsAndValues: any) {
    return this.selectWithAndOne(collectionName, columnsAndValues);
  }

  async updateAttendance(collectionName: string, columnsAndValues: any, targetColumnsAndValues: any) {
    return this.updateSingle(collectionName, columnsAndValues, targetColumnsAndValues);
  }

  async deleteAttendance(collectionName: string, targetColumnsAndValues: any) {
    return this.deleteOne(collectionName, targetColumnsAndValues);
  }

  async getJoinWithAnd(collectionName: string, joinArr: any[]) {
    return this.joinWithAnd(collectionName, joinArr);
  }
}
