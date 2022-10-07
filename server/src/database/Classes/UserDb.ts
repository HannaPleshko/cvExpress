import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger';
import { DatabaseError } from 'pg';
import { Database } from '..';
import { IUser } from '../Interfaces';

export class UserDB extends Database {
  async create(data: IUser): Promise<IUser> {
    try {
      await this.pool.query('BEGIN');

      const { firstname, header_id, lastname } = data;

      const query = {
        text: 'INSERT INTO Users (firstName, header_id, lastName) VALUES ($1, $2, $3) RETURNING *',
        values: [firstname, header_id, lastname],
      };

      const result: IUser = (await this.pool.query(query)).rows[0];
      await this.pool.query('COMMIT');

      return result;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_USER_CREATE_NOT_CREATED);
    }
  }

  async getAll(): Promise<IUser[] | []> {
    try {
      const query = { text: 'SELECT * FROM Users' };

      const result: IUser[] = (await this.pool.query(query)).rows;

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_USER_GET_ALL_NOT_GOT);
    }
  }

  async getById(id: string): Promise<IUser | undefined> {
    try {
      const query = {
        text: 'SELECT * from Users WHERE user_id=$1',
        values: [id],
      };

      const result: IUser = (await this.pool.query(query)).rows[0];

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_USER_GET_BY_ID_NOT_GOT);
    }
  }

  async getByName(first_name: string, last_name: string): Promise<IUser | undefined> {
    try {
      const query = {
        text: 'SELECT * from Users WHERE firstName=$1 and lastName=$2',
        values: [first_name, last_name],
      };

      const result: IUser = (await this.pool.query(query)).rows[0];

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_USER_GET_BY_ID_NOT_GOT);
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');

      const query = {
        text: 'DELETE FROM Users WHERE user_id=$1 RETURNING *',
        values: [id],
      };

      const result = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return result.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_USER_DELETE_NOT_DELETED);
    }
  }

  async updateById(id: string, data: IUser): Promise<IUser> {
    try {
      await this.pool.query('BEGIN');

      const { firstname, header_id, lastname } = data;

      const queryForUpdate = {
        text: `
        UPDATE Users SET
        firstName = COALESCE($1, firstName),
        lastName = COALESCE($2, lastName),
        header_id = COALESCE($3, header_id)
        WHERE user_id=$4 
        RETURNING *
       `,
        values: [firstname, lastname, header_id, id],
      };

      const updatedExperience: IUser = (await this.pool.query(queryForUpdate)).rows[0];
      await this.pool.query('COMMIT');

      return updatedExperience;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_USER_UPDATE_NOT_UPDATED);
    }
  }
}
