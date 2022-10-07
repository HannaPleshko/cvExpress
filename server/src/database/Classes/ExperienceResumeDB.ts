import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger';
import { DatabaseError } from 'pg';
import { Database } from '..';
import { IExperienceResume } from '../Interfaces/index';

export class ExperienceResumeDB extends Database {
  /**
   * CREATE Experiences_Resume column.
   * @param {IExperienceResume} data The id's of resume and experience
   * @returns {IExperienceResume} The Experiences_Resume column
   */
  async create(data: IExperienceResume): Promise<IExperienceResume> {
    try {
      await this.pool.query('BEGIN');

      const { resume_id, experience_id } = data;

      const query = {
        text: 'INSERT INTO Experiences_Resume (resume_id,experience_id) VALUES ($1,$2) RETURNING *',
        values: [resume_id, experience_id],
      };

      const result: IExperienceResume = (await this.pool.query(query)).rows[0];
      await this.pool.query('COMMIT');

      return result;
    } catch (err) {
      await this.pool.query('ROLLBACK');

      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_EXPERIENCES_RESUME_CREATE_NOT_CREATED);
    }
  }

  async getAll(): Promise<IExperienceResume[] | []> {
    try {
      const query = { text: 'SELECT * FROM Experiences_Resume ORDER BY resume_id' };

      const result: IExperienceResume[] | [] = (await this.pool.query(query)).rows;

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_EXPERIENCES_RESUME_GET_ALL_NOT_GOT);
    }
  }

  async getById(id: string): Promise<IExperienceResume[] | undefined> {
    try {
      const query = { text: 'SELECT * from Experiences_Resume WHERE resume_id=$1', values: [id] };

      const result: IExperienceResume[] | undefined = (await this.pool.query(query)).rows;

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_EXPERIENCES_RESUME_GET_BY_ID_NOT_GOT);
    }
  }

  /**
   * DELETE Experiences_Resume column.
   * @param {IExperienceResume} data The id's of resume and experience
   * @returns {boolean} That the column has been deleted
   */
  async deleteOne(data: IExperienceResume): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');
      const query = {
        text: 'DELETE FROM Experiences_Resume WHERE experience_id=$1 and resume_id=$2 ',
        values: [data.resume_id, data.experience_id],
      };

      const result = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return result.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');

      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_EXPERIENCES_RESUME_DELETE_ONE_NOT_DELETED);
    }
  }

  /**
   * DELETE Experiences_Resume columns.
   * @param {string} id The id of resume
   * @returns {boolean} The deleted Experiences_Resume columns
   */
  async deleteById(id: string): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');
      const query = { text: 'DELETE FROM Experiences_Resume WHERE resume_id=$1', values: [id] };

      const result = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return result.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_EXPERIENCES_RESUME_DELETE_BY_ID_NOT_DELETED);
    }
  }
}
