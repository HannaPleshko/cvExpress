import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger';
import { DatabaseError } from 'pg';
import { Database } from '..';
import { IEnvironmentProject } from '../Interfaces/index';

export class EnvironmentProjectDB extends Database {
  /**
   * CREATE Environments_Projects column.
   * @param {IEnvironmentProject} data The id's of project and environment
   * @returns {IEnvironmentProject} The Environments_Projects column
   */
  async create(data: IEnvironmentProject): Promise<IEnvironmentProject> {
    try {
      await this.pool.query('BEGIN');

      const { project_id, environment_id } = data;

      const query = {
        text: 'INSERT INTO Environments_Projects (project_id,environment_id) VALUES ($1,$2) RETURNING *',
        values: [project_id, environment_id],
      };

      const result: IEnvironmentProject = (await this.pool.query(query)).rows[0];
      await this.pool.query('COMMIT');

      return result;
    } catch (err) {
      await this.pool.query('ROLLBACK');

      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_ENVIRONMENT_PROJECT_CREATE_NOT_CREATED);
    }
  }

  async getAll(): Promise<IEnvironmentProject[] | []> {
    try {
      const query = { text: 'SELECT * FROM Environments_Projects ORDER BY project_id' };

      const result: IEnvironmentProject[] | [] = (await this.pool.query(query)).rows;

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_ENVIRONMENT_PROJECT_GET_ALL_NOT_GOT);
    }
  }

  async getById(id: string): Promise<IEnvironmentProject[] | undefined> {
    try {
      const query = { text: 'SELECT * from Environments_Projects WHERE project_id=$1', values: [id] };

      const result: IEnvironmentProject[] | undefined = (await this.pool.query(query)).rows;

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_ENVIRONMENT_PROJECT_GET_BY_ID_NOT_GOT);
    }
  }

  async getOne(project_id, environment_id: string): Promise<IEnvironmentProject[] | undefined> {
    try {
      const query = { text: 'SELECT * from Environments_Projects WHERE project_id=$1 and environment_id=$2', values: [project_id, environment_id] };

      const result: IEnvironmentProject[] | undefined = (await this.pool.query(query)).rows[0];

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_ENVIRONMENT_PROJECT_GET_BY_ID_NOT_GOT);
    }
  }

  /**
   * DELETE Environments_Projects column.
   * @param {IEnvironmentProject} data The id's of project and environment
   * @returns {boolean} That the column has been deleted
   */
  async deleteOne(data: IEnvironmentProject): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');

      const { project_id, environment_id } = data;

      const query = {
        text: 'DELETE FROM Environments_Projects WHERE project_id=$1 and environment_id=$2 ',
        values: [project_id, environment_id],
      };

      const result = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return result.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');

      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_ENVIRONMENT_PROJECT_DELETE_ONE_NOT_DELETED);
    }
  }

  /**
   * DELETE Environments_Projects columns.
   * @param {string} id The id of project
   * @returns {boolean} The deleted Environments_Projects columns
   */
  async deleteById(id: string): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');
      const query = { text: 'DELETE FROM Environments_Projects WHERE project_id=$1', values: [id] };

      const result = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return result.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_ENVIRONMENT_PROJECT_DELETE_BY_ID_NOT_DELETED);
    }
  }
}
