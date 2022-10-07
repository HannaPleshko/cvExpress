import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger';
import { DatabaseError } from 'pg';
import { Database } from '..';
import { IResume, ISkills } from '../Interfaces';

export class ResumeDB extends Database {
  async create(data: IResume): Promise<IResume> {
    try {
      await this.pool.query('BEGIN');

      const { skill_id, filename, user_id } = data;

      const queryForGetSkill = {
        text: 'SELECT * FROM Skills WHERE skill_id=$1',
        values: [skill_id],
      };

      const skill: ISkills = (await this.pool.query(queryForGetSkill)).rows[0];

      if (!skill) {
        throw new HttpException(400, ExceptionType.DB_RESUME_CREATE_NOT_FOUND);
      }

      const query = {
        text: 'INSERT INTO Resumes (skill_id, filename, user_id) VALUES ($1, $2, $3) RETURNING *',
        values: [skill_id, filename, user_id],
      };

      const result: IResume = (await this.pool.query(query)).rows[0];
      await this.pool.query('COMMIT');

      return result;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_RESUME_CREATE_NOT_CREATED);
    }
  }

  async getAll(): Promise<IResume[] | []> {
    try {
      const query = { text: 'SELECT * FROM Resumes' };

      const result: IResume[] = (await this.pool.query(query)).rows;

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_RESUME_GET_ALL_NOT_GOT);
    }
  }

  async getById(id: string): Promise<IResume | undefined> {
    try {
      const query = {
        text: 'SELECT * from Resumes WHERE resume_id=$1',
        values: [id],
      };

      const result: IResume = (await this.pool.query(query)).rows[0];

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_RESUME_GET_BY_ID_NOT_GOT);
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');
      const query = {
        text: 'DELETE FROM Resumes WHERE resume_id=$1 RETURNING *',
        values: [id],
      };

      const result = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return result.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_RESUME_DELETE_NOT_DELETED);
    }
  }

  async updateById(id: string, data: IResume): Promise<IResume> {
    try {
      await this.pool.query('BEGIN');
      const queryForGet = { text: 'SELECT * from Resumes WHERE resume_id=$1', values: [id] };

      const resume: IResume = (await this.pool.query(queryForGet)).rows[0];
      if (!resume) throw new HttpException(404, ExceptionType.DB_RESUME_UPDATE_NOT_FOUND);

      const { skill_id, filename, user_id } = { ...resume, ...data };
      const queryForUpdate = {
        text: 'UPDATE Resumes SET fileName=$1, user_id=$2,skill_id=$3 WHERE resume_id=$4 RETURNING *',
        values: [filename, user_id, skill_id, id],
      };

      const result: IResume = (await this.pool.query(queryForUpdate)).rows[0];
      await this.pool.query('COMMIT');

      return result;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_RESUME_UPDATE_NOT_UPDATED);
    }
  }
}
