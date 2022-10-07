import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger';
import { DatabaseError } from 'pg';
import { Database } from '..';
import { IEducation } from '../Interfaces';

export class EducationDB extends Database {
  async create(data: IEducation): Promise<IEducation> {
    try {
      await this.pool.query('BEGIN');

      const { education, resume_id } = data;

      const query = {
        text: 'INSERT INTO Educations (education,resume_id) VALUES ($1,$2) RETURNING *',
        values: [education, resume_id],
      };

      const result: IEducation = (await this.pool.query(query)).rows[0];
      await this.pool.query('COMMIT');

      return result;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_EDUCATION_CREATE_NOT_CREATED);
    }
  }

  async getAll(): Promise<IEducation[] | []> {
    try {
      const query = { text: 'SELECT * FROM Educations' };

      const result: IEducation[] | [] = (await this.pool.query(query)).rows;

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_EDUCATION_GET_ALL_NOT_GOT);
    }
  }

  async getAllByResumeId(resumeId: string): Promise<IEducation[] | undefined> {
    try {
      const query = { text: 'SELECT * from Educations WHERE resume_id=$1', values: [resumeId] };

      const result: IEducation[] | undefined = (await this.pool.query(query)).rows;

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_EDUCATION_GET_ALL_BY_RESUME_ID_NOT_GOT);
    }
  }

  async getById(id: string): Promise<IEducation | undefined> {
    try {
      const query = { text: 'SELECT * from Educations WHERE education_id=$1', values: [id] };

      const result: IEducation | undefined = (await this.pool.query(query)).rows[0];

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_EDUCATION_GET_BY_ID_NOT_GOT);
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');
      const query = { text: 'DELETE FROM Educations WHERE education_id=$1', values: [id] };

      const result = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return result.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_EDUCATION_DELETE_NOT_DELETED);
    }
  }
}
