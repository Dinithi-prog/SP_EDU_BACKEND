import {Database} from '@core/config/database/database.model';
import {Injectable, Logger} from '@nestjs/common';

@Injectable()
export class DatabaseRepository {
  constructor(private readonly database: Database) {}

  /**
   * Performs find operation on a MongoDB collection.
   *
   * @param {string} collectionName - The name of the collection to query.
   * @param {any} columnsAndValues - An object representing the query conditions.
   * @returns {Promise<any[]>} - An array of matching documents.
   */
  async selectWithAnd(collectionName: string, columnsAndValues: any) {
    const dbCollection = this.database.collection(collectionName);
    try {
      return await dbCollection.find(columnsAndValues).toArray();
    } catch (err) {
      Logger.log('Query error in selectWithAnd', err);
    }
  }

  /**
   * Performs findOne operation and returns a single document.
   *
   * @param {string} collectionName - The name of the collection to query.
   * @param {any} columnsAndValues - An object representing the query conditions.
   * @returns {Promise<any | null>} - The matching document or null if not found.
   */
  async selectWithAndOne(collectionName: string, columnsAndValues: any) {
    const dbCollection = this.database.collection(collectionName);
    try {
      return await dbCollection.findOne(columnsAndValues);
    } catch (err) {
      Logger.log('Query error in selectWithAndOne', err);
    }
  }

  /**
   * Inserts a single document into a MongoDB collection.
   *
   * @param {string} collectionName - The name of the collection to insert into.
   * @param {any} columnsAndValues - The document to be inserted.
   * @returns {Promise<any | null>} - The inserted document or null if insertion fails.
   */
  async insertSingle(collectionName: string, columnsAndValues: any) {
    const dbCollection = this.database.collection(collectionName);
    try {
      const result = await dbCollection.insertOne(columnsAndValues);
      if (result.acknowledged) {
        const insertedId = result.insertedId; // Assuming insertedId is of type ObjectId

        const addedDocument = await dbCollection.findOne({_id: insertedId});

        if (addedDocument) {
          return addedDocument;
        } else {
          Logger.error('Inserted document not found:', insertedId);
          return null;
        }
      } else {
        Logger.error('Insertion failed:', result);
        return null;
      }
    } catch (err) {
      Logger.log('Query error in insertSingle', err);
    }
  }

  /**
   * Updates a single document in a MongoDB collection based on specified conditions.
   *
   * @param {string} collectionName - The name of the collection to update.
   * @param {any} columnsToUpdate - The fields and values to update in the document.
   * @param {any} targetColumnsAndValues - The conditions to identify the document to update.
   * @returns {Promise<any>} - The update result.
   */
  async updateSingle(collectionName: string, columnsToUpdate: any, targetColumnsAndValues: any) {
    const dbCollection = this.database.collection(collectionName);
    try {
      const result = await dbCollection.updateOne(targetColumnsAndValues, {$set: columnsToUpdate});

      if (result.modifiedCount === 1) {
        return result;
      } else {
        Logger.error('Document not found or update failed', result);
      }
    } catch (err) {
      Logger.log('Query error in updateSingle', err);
    }
  }

  /**
   * Updates a single document in a MongoDB collection based on specified conditions
   * and retrieves the updated document.
   *
   * @param {string} collectionName - The name of the collection to update.
   * @param {any} columnsToUpdate - The fields and values to update in the document.
   * @param {any} targetColumnsAndValues - The conditions to identify the document to update.
   * @returns {Promise<any>} - The updated document.
   */
  async updateAndReturn(collectionName: string, columnsToUpdate: any, targetColumnsAndValues: any) {
    const dbCollection = this.database.collection(collectionName);
    try {
      return await dbCollection.findOneAndUpdate(
        targetColumnsAndValues,
        {$set: columnsToUpdate},
        {
          upsert: true, // Create the document if it doesn't exist
          returnDocument: 'after', // Return the updated document
        },
      );
    } catch (err) {
      console.error('Query error in updateAndReturn:', err);
      return null;
    }
  }

  async updateArrayAndReturn(collectionName: string, updateOperator: any, targetColumnsAndValues: any) {
    const dbCollection = this.database.collection(collectionName);
    try {
      return await dbCollection.findOneAndUpdate(
        targetColumnsAndValues,
        updateOperator, // Use the provided operator for array operations
        {
          upsert: true,
          returnDocument: 'after',
        },
      );
    } catch (err) {
      console.error('Query error in updateAndReturn:', err);
      return null;
    }
  }

  /**
   * Performs an aggregation operation on a MongoDB collection.
   *
   * @param {string} collectionName - The name of the collection to aggregate and join.
   * @param {any[]} pipeline - The aggregation pipeline to apply.
   * @returns {Promise<any[]>} - An array of aggregated and joined results.
   */
  async joinWithAnd(collectionName: string, pipline: any[]) {
    const dbCollection = this.database.collection(collectionName);
    try {
      const aggregation = dbCollection.aggregate(pipline);
      const results = await aggregation.toArray();
      return results;
    } catch (err) {
      Logger.log('Query error in joinWithAnd', err);
    }
  }

  /**
   * Deletes a single document from a MongoDB collection based on specified conditions.
   *
   * @param {string} collectionName - The name of the collection to delete from.
   * @param {any} targetColumnsAndValues - The conditions to identify the document to delete.
   * @returns {Promise<any>} - The deletion result.
   */
  async deleteOne(collectionName: string, targetColumnsAndValues: any) {
    const dbCollection = this.database.collection(collectionName);
    try {
      return await dbCollection.deleteOne(targetColumnsAndValues);
    } catch (err) {
      Logger.log('Query error in deleteOne', err);
    }
  }
}