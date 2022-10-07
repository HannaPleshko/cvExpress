import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger';
import { DatabaseError } from 'pg';
import { Database } from '..';
import { IExperience } from '../Interfaces';

export class ExperienceDb extends Database {
  async create(data: IExperience): Promise<IExperience> {
    try {
      await this.pool.query('BEGIN');
      const { start_date, end_date, company_id, user_position, position_level } = data;

      const query = {
        text: 'INSERT INTO Experiences (start_date, end_date, company_id, user_position, position_level) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        values: [start_date, end_date, company_id, user_position, position_level],
      };

      const experience: IExperience = (await this.pool.query(query)).rows[0];
      await this.pool.query('COMMIT');

      return experience;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_EXPERIENCE_CREATE_NOT_CREATED);
    }
  }

  async getAll(): Promise<IExperience[] | []> {
    try {
      const query = { text: 'SELECT * FROM Experiences' };

      const experiences: IExperience[] = (await this.pool.query(query)).rows;

      return experiences;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_EXPERIENCE_GET_ALL_NOT_GOT);
    }
  }

  async getById(id: string): Promise<IExperience | undefined> {
    try {
      const query = {
        text: 'SELECT * from Experiences WHERE experience_id=$1',
        values: [id],
      };

      const experience: IExperience = (await this.pool.query(query)).rows[0];

      return experience;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_EXPERIENCE_GET_BY_ID_NOT_GOT);
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');
      const query = {
        text: 'DELETE FROM Experiences WHERE experience_id=$1 RETURNING *',
        values: [id],
      };

      const deletedExperience = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return deletedExperience.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_EXPERIENCE_DELETE_NOT_DELETED);
    }
  }

  async updateById(id: string, data: IExperience): Promise<IExperience> {
    try {
      await this.pool.query('BEGIN');
      const queryForGet = { text: 'SELECT * from Experiences WHERE experience_id=$1', values: [id] };

      const experience: IExperience = (await this.pool.query(queryForGet)).rows[0];
      if (!experience) throw new HttpException(404, ExceptionType.DB_EXPERIENCE_UPDATE_NOT_FOUND);

      const { start_date, end_date, company_id, user_position, position_level } = { ...experience, ...data };

      const queryForUpdate = {
        text: 'UPDATE Experiences SET start_date=$1, end_date=$2, company_id=$3, user_position=$4, position_level=$5  WHERE experience_id=$6 RETURNING *',
        values: [start_date, end_date, company_id, user_position, position_level, id],
      };

      const updatedExperience: IExperience = (await this.pool.query(queryForUpdate)).rows[0];
      await this.pool.query('COMMIT');

      return updatedExperience;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_EXPERIENCE_UPDATE_NOT_UPDATED);
    }
  }
}
