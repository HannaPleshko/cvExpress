import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger';
import { DatabaseError } from 'pg';
import { Database } from '..';
import { IHeader } from '../Interfaces';

export class HeaderDB extends Database {
  async create(data: IHeader): Promise<IHeader> {
    try {
      await this.pool.query('BEGIN');
      const { profiles, user_position, position_level } = data;

      const query = {
        text: 'INSERT INTO Headers (user_position, position_level, profiles) VALUES ($1, $2, $3) RETURNING *',
        values: [user_position, position_level, profiles],
      };

      const header: IHeader = (await this.pool.query(query)).rows[0];
      await this.pool.query('COMMIT');

      return header;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_HEADER_CREATE_NOT_CREATED);
    }
  }

  async getAll(): Promise<IHeader[]> {
    try {
      const query = { text: 'SELECT * FROM Headers' };

      const headers: IHeader[] = (await this.pool.query(query)).rows;

      return headers;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_HEADER_GET_ALL_NOT_GOT);
    }
  }

  async getById(id: string): Promise<IHeader | undefined> {
    try {
      const query = { text: 'SELECT * from Headers WHERE header_id=$1', values: [id] };

      const header: IHeader = (await this.pool.query(query)).rows[0];

      return header;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_HEADER_GET_BY_ID_NOT_GOT);
    }
  }

  async getByUserId(id: string): Promise<IHeader | undefined> {
    try {
      const query = { text: 'SELECT * from Headers WHERE header_id=$1', values: [id] };

      const header: IHeader = (await this.pool.query(query)).rows[0];

      return header;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_HEADER_GET_BY_ID_NOT_GOT); //////////////
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');
      const query = { text: 'DELETE FROM Headers WHERE header_id=$1', values: [id] };

      const deletedHeaders = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return deletedHeaders.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_HEADER_DELETE_NOT_DELETED);
    }
  }

  async updateById(id: string, data: IHeader): Promise<IHeader> {
    try {
      await this.pool.query('BEGIN');
      const queryForGet = { text: 'SELECT * from Headers WHERE header_id=$1', values: [id] };

      const header: IHeader = (await this.pool.query(queryForGet)).rows[0];
      if (!header) throw new HttpException(404, ExceptionType.DB_HEADER_UPDATE_NOT_FOUND);

      const { profiles, user_position, position_level } = { ...header, ...data };

      const queryForUpdate = {
        text: 'UPDATE Headers SET user_position=$1, position_level=$2, profiles=$3 WHERE header_id=$4 RETURNING *',
        values: [user_position, position_level, profiles, id],
      };

      const updatedHeader: IHeader = (await this.pool.query(queryForUpdate)).rows[0];
      await this.pool.query('COMMIT');

      return updatedHeader;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_HEADER_UPDATE_NOT_UPDATED);
    }
  }
}
