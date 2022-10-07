import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger';
import { DatabaseError } from 'pg';
import { Database } from '..';
import { IResponsibility } from '../Interfaces';

export class ResponsibilityDB extends Database {
  async create(data: IResponsibility): Promise<IResponsibility> {
    try {
      await this.pool.query('BEGIN');

      const { responsibility } = data;

      const query = {
        text: 'INSERT INTO Responsibilities (responsibility) VALUES ($1) RETURNING *',
        values: [responsibility],
      };

      const bewResponsibility: IResponsibility = (await this.pool.query(query)).rows[0];
      await this.pool.query('COMMIT');

      return bewResponsibility;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_RESPONSIBILITIES_CREATE_NOT_CREATED);
    }
  }

  async getAll(): Promise<IResponsibility[] | []> {
    try {
      const query = { text: 'SELECT * FROM Responsibilities' };

      const responsibilities: IResponsibility[] | [] = (await this.pool.query(query)).rows;

      return responsibilities;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_RESPONSIBILITIES_GET_ALL_NOT_GOT);
    }
  }

  async notExist(res: string): Promise<boolean> {
    try {
      const query = { text: 'SELECT * from Responsibilities WHERE responsibility=$1', values: [res] };

      const result: IResponsibility | undefined = (await this.pool.query(query)).rows[0];

      return result === undefined;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_RESPONSIBILITIES_NOT_EXIST_NOT_FOUND);
    }
  }

  async getByResponsibility(responsibility: string): Promise<IResponsibility | undefined> {
    try {
      const query = { text: 'SELECT * from Responsibilities WHERE responsibility=$1', values: [responsibility] };

      const result: IResponsibility | undefined = (await this.pool.query(query)).rows[0];

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(404, ExceptionType.DB_RESPONSIBILITIES_GET_BY_RESPONSIBILITY);
    }
  }

  async getById(id: string): Promise<IResponsibility | undefined> {
    try {
      const query = { text: 'SELECT * from Responsibilities WHERE responsibility_id=$1', values: [id] };

      const responsibility: IResponsibility | undefined = (await this.pool.query(query)).rows[0];

      return responsibility;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_RESPONSIBILITIES_GET_BY_ID_NOT_GOT);
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');
      const query = { text: 'DELETE FROM Responsibilities WHERE responsibility_id=$1', values: [id] };

      const deletedResponsibility = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return deletedResponsibility.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_RESPONSIBILITIES_DELETE_NOT_DELETED);
    }
  }
}
