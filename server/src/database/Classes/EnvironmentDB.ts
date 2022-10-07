import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger';
import { DatabaseError } from 'pg';
import { Database } from '..';
import { IEnvironment } from '../Interfaces';

export class EnvironmentDB extends Database {
  async create(data: IEnvironment): Promise<IEnvironment> {
    try {
      await this.pool.query('BEGIN');

      const { label, category, priority } = data;

      const queryGetEnvironment = {
        text: 'SELECT * FROM Environments WHERE label = $1',
        values: [label],
      };

      const gotEnvironment: IEnvironment[] | [] = (await this.pool.query(queryGetEnvironment)).rows[0];
      if (gotEnvironment) throw new HttpException(409, ExceptionType.ENVIRONMENT_SAVE_EXIST);

      const query = {
        text: 'INSERT INTO Environments (label, category, priority) VALUES ($1, $2, $3) RETURNING *',
        values: [label, category, priority],
      };

      const environment: IEnvironment = (await this.pool.query(query)).rows[0];
      await this.pool.query('COMMIT');

      return environment;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_ENVIRONMENT_CREATE_NOT_CREATED);
    }
  }

  async getAll(): Promise<IEnvironment[] | []> {
    try {
      const query = { text: 'SELECT * FROM Environments' };

      const environments: IEnvironment[] | [] = (await this.pool.query(query)).rows;

      return environments;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_ENVIRONMENT_GET_ALL_NOT_GOT);
    }
  }

  async notExist(env: string): Promise<IEnvironment | undefined> {
    try {
      const query = { text: 'SELECT * from Environments WHERE label=$1', values: [env] };

      const result: IEnvironment | undefined = (await this.pool.query(query)).rows[0];

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_ENVIRONMENT_NOT_EXIST_NOT_FOUND);
    }
  }

  async getById(id: string): Promise<IEnvironment | undefined> {
    try {
      const query = {
        text: 'SELECT * from Environments WHERE environment_id=$1',
        values: [id],
      };

      const environment: IEnvironment | undefined = (await this.pool.query(query)).rows[0];

      return environment;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_ENVIRONMENT_NOT_GOT);
    }
  }

  async getByEnvironment(env: string): Promise<IEnvironment | undefined> {
    try {
      const query = {
        text: 'SELECT * from Environments WHERE label=$1',
        values: [env],
      };

      const result: IEnvironment | undefined = (await this.pool.query(query)).rows[0];

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(404, ExceptionType.DB_ENVIRONMENT_GET_BY_ENVIRONMENT_NOT_GOT);
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');
      const query = {
        text: 'DELETE FROM Environments WHERE environment_id=$1',
        values: [id],
      };

      const deletedEnvironment = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return deletedEnvironment.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_ENVIRONMENT_DELETE_NOT_DELETED);
    }
  }

  async updateById(id: string, data: IEnvironment): Promise<IEnvironment> {
    try {
      await this.pool.query('BEGIN');

      const { label, category, priority } = data;

      const queryForUpdate = {
        text: `UPDATE Environments SET
        label = COALESCE($1, label),
        category = COALESCE($2, category),
        priority = COALESCE($3, priority)
        WHERE environment_id = $4
        RETURNING *`,
        values: [label, category, priority, id],
      };

      const updatedEnvironment: IEnvironment = (await this.pool.query(queryForUpdate)).rows[0];
      if (!updatedEnvironment) throw new HttpException(404, ExceptionType.DB_ENVIRONMENT_UPDATE_NOT_FOUND);

      await this.pool.query('COMMIT');

      return updatedEnvironment;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_ENVIRONMENT_UPDATE_NOT_UPDATED);
    }
  }
}
