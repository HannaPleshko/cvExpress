import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger';
import { DatabaseError } from 'pg';
import { Database } from '..';
import { IProject } from '../Interfaces/index';

export class ProjectDB extends Database {
  async create(data: IProject): Promise<IProject> {
    try {
      await this.pool.query('BEGIN');

      const { user_position, position_level, description } = data;

      const query = {
        text: 'INSERT INTO Projects (user_position, position_level, description) VALUES ($1,$2,$3) RETURNING *',
        values: [user_position, position_level, description],
      };

      const project: IProject = (await this.pool.query(query)).rows[0];
      await this.pool.query('COMMIT');

      return project;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      if (err instanceof HttpException) throw err;

      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_PROJECT_CREATE_NOT_CREATED);
    }
  }

  async getAll(): Promise<IProject[] | []> {
    try {
      const query = { text: 'SELECT * FROM Projects' };

      const projects: IProject[] | [] = (await this.pool.query(query)).rows;

      return projects;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_PROJECT_GET_ALL_NOT_GOT);
    }
  }

  async getById(id: string): Promise<IProject | undefined> {
    try {
      const query = { text: 'SELECT * from Projects WHERE project_id=$1', values: [id] };

      const project: IProject | undefined = (await this.pool.query(query)).rows[0];

      return project;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_PROJECT_GET_BY_ID_NOT_GOT);
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');
      const query = { text: 'DELETE FROM Projects WHERE project_id=$1', values: [id] };

      const deletedProject = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return deletedProject.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_PROJECT_DELETE_NOT_DELETED);
    }
  }
  async updateById(id: string, data: IProject): Promise<IProject> {
    try {
      const queryForGet = { text: 'SELECT * from Projects WHERE project_id=$1', values: [id] };

      const oldProject: IProject = (await this.pool.query(queryForGet)).rows[0];

      if (!oldProject) {
        throw new HttpException(404, ExceptionType.DB_PROJECT_UPDATE_NOT_FOUND);
      }

      const { user_position, position_level, description } = { ...oldProject, ...data } as IProject;

      const queryForUpdate = {
        text: 'UPDATE Projects SET user_position=$1, position_level=$2, description=$3  WHERE project_id=$3 RETURNING *',
        values: [user_position, position_level, description],
      };

      const updatedProject: IProject = (await this.pool.query(queryForUpdate)).rows[0];

      return updatedProject;
    } catch (err) {
      if (err instanceof HttpException) throw err;

      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_PROJECT_UPDATE_NOT_UPDATED);
    }
  }
}
