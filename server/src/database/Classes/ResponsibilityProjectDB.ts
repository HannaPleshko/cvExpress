import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger';
import { DatabaseError } from 'pg';
import { Database } from '..';
import { IResponsibilityProject } from '../Interfaces/index';

export class ResponsibilityProjectDB extends Database {
  /**
   * CREATE Responsibilities_Projects column.
   * @param {IResponsibilityProject} data The id's of project and responsibility
   * @returns {IResponsibilityProject} The Responsibilities_Projects column
   */
  async create(data: IResponsibilityProject): Promise<IResponsibilityProject> {
    try {
      await this.pool.query('BEGIN');

      const { project_id, responsibility_id } = data;

      const query = {
        text: 'INSERT INTO Responsibilities_Projects (project_id,responsibility_id) VALUES ($1,$2) RETURNING *',
        values: [project_id, responsibility_id],
      };

      const result: IResponsibilityProject = (await this.pool.query(query)).rows[0];
      await this.pool.query('COMMIT');

      return result;
    } catch (err) {
      await this.pool.query('ROLLBACK');

      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_RESPONSIBILIY_PROJECT_CREATE_NOT_CREATED);
    }
  }

  async getAll(): Promise<IResponsibilityProject[] | []> {
    try {
      const query = { text: 'SELECT * FROM Responsibilities_Projects ORDER BY project_id' };

      const result: IResponsibilityProject[] | [] = (await this.pool.query(query)).rows;

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_RESPONSIBILIY_PROJECT_GET_ALL_NOT_GOT);
    }
  }

  async getById(id: string): Promise<IResponsibilityProject[] | undefined> {
    try {
      const query = { text: 'SELECT * from Responsibilities_Projects WHERE project_id=$1', values: [id] };

      const result: IResponsibilityProject[] | undefined = (await this.pool.query(query)).rows;

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_RESPONSIBILIY_PROJECT_GET_BY_ID_NOT_GOT);
    }
  }

  async getOne(project_id: string, responsibility_id: string): Promise<IResponsibilityProject | undefined> {
    try {
      const query = {
        text: 'SELECT * from Responsibilities_Projects WHERE project_id=$1 and responsibility_id=$2',
        values: [project_id, responsibility_id],
      };

      const result: IResponsibilityProject | undefined = (await this.pool.query(query)).rows[0];

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_RESPONSIBILIY_PROJECT_GET_BY_ID_NOT_GOT);
    }
  }

  /**
   * DELETE Responsibilities_Projects column.
   * @param {IResponsibilityProject} data The id's of project and responsibility
   * @returns {boolean} That the column has been deleted
   */
  async deleteOne(data: IResponsibilityProject): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');

      const { project_id, responsibility_id } = data;

      const query = {
        text: 'DELETE FROM Responsibilities_Projects WHERE project_id=$1 and responsibility_id=$2 ',
        values: [project_id, responsibility_id],
      };

      const result = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return result.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');

      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_RESPONSIBILIY_PROJECT_DELETE_ONE_NOT_DELETED);
    }
  }

  /**
   * DELETE Responsibilities_Projects columns.
   * @param {string} id The id of project
   * @returns {boolean} The deleted Responsibilities_Projects columns
   */
  async deleteById(id: string): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');
      const query = { text: 'DELETE FROM Responsibilities_Projects WHERE project_id=$1', values: [id] };

      const result = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return result.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_RESPONSIBILIY_PROJECT_DELETE_BY_ID_NOT_DELETED);
    }
  }
}
