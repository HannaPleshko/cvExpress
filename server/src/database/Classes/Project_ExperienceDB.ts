import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger';
import { DatabaseError } from 'pg';
import { Database } from '..';
import { IProjectExperience } from '../Interfaces/index';

export class Project_ExperienceDB extends Database {
  /**
   * CREATE Projects_Experiences column.
   * @param {IProjectExperience} data The id's of project and experience
   * @returns {IProjectExperience} The Projects_Experiences column
   */
  async create(data: IProjectExperience): Promise<IProjectExperience> {
    try {
      await this.pool.query('BEGIN');

      const { project_id, experience_id } = data;

      const query = {
        text: 'INSERT INTO Projects_Experiences (project_id,experience_id) VALUES ($1,$2) RETURNING *',
        values: [project_id, experience_id],
      };

      const result: IProjectExperience = (await this.pool.query(query)).rows[0];
      await this.pool.query('COMMIT');

      return result;
    } catch (err) {
      await this.pool.query('ROLLBACK');

      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_PROJECT_EXPERIENCE_CREATE_NOT_CREATED);
    }
  }

  async getAll(): Promise<IProjectExperience[] | []> {
    try {
      const query = { text: 'SELECT * FROM Projects_Experiences ORDER BY experience_id' };

      const result: IProjectExperience[] | [] = (await this.pool.query(query)).rows;

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_PROJECT_EXPERIENCE_GET_ALL_NOT_GOT);
    }
  }

  async getById(id: string): Promise<IProjectExperience[] | undefined> {
    try {
      const query = { text: 'SELECT * from Projects_Experiences WHERE experience_id=$1', values: [id] };

      const result: IProjectExperience[] | undefined = (await this.pool.query(query)).rows;

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_PROJECT_EXPERIENCE_GET_BY_ID_NOT_GOT);
    }
  }

  /**
   * DELETE Projects_Experiences column.
   * @param {IProjectExperience} data The id's of project and experience
   * @returns {boolean} That the column has been deleted
   */
  async deleteOne(data: IProjectExperience): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');
      const query = {
        text: 'DELETE FROM Projects_Experiences WHERE experience_id=$1 and project_id=$2 ',
        values: [data.project_id, data.experience_id],
      };

      const result = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return result.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');

      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_PROJECT_EXPERIENCE_DELETE_ONE_NOT_DELETED);
    }
  }

  /**
   * DELETE Projects_Experiences columns.
   * @param id The id of experience
   * @returns {boolean} The deleted Projects_Experiences columns
   */
  async deleteById(id: string): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');
      const query = { text: 'DELETE FROM Projects_Experiences WHERE experience_id=$1', values: [id] };

      const result = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return result.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_PROJECT_EXPERIENCE_DELETE_BY_ID_NOT_DELETED);
    }
  }
}
