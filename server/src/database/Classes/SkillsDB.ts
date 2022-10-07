import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger';
import { DatabaseError } from 'pg';
import { Database } from '..';
import { ISkills, ISkillsForCreate } from '../Interfaces';

export class SkillsDB extends Database {
  async create(data: ISkillsForCreate): Promise<ISkills> {
    try {
      await this.pool.query('BEGIN');

      const { operating_systems } = data;

      const query = {
        text: 'INSERT INTO Skills (operating_systems) VALUES ($1) RETURNING *',
        values: [operating_systems],
      };

      const skill: ISkills = (await this.pool.query(query)).rows[0];
      await this.pool.query('COMMIT');

      return skill;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_SKILL_CREATE_NOT_CREATED);
    }
  }

  async getAll(): Promise<ISkills[] | []> {
    try {
      const query = { text: 'SELECT * FROM Skills' };

      const skills: ISkills[] = (await this.pool.query(query)).rows;

      return skills;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_SKILL_GET_ALL_NOT_GOT);
    }
  }

  async getById(id: string): Promise<ISkills | undefined> {
    try {
      const query = {
        text: 'SELECT * from Skills WHERE skill_id=$1',
        values: [id],
      };

      const skill: ISkills = (await this.pool.query(query)).rows[0];

      return skill;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_SKILL_GET_BY_ID_NOT_GOT);
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');
      const query = {
        text: 'DELETE FROM Skills WHERE skill_id=$1 RETURNING *',
        values: [id],
      };

      const deletedSkill = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return deletedSkill.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_SKILL_DELETE_NOT_DELETED);
    }
  }

  async updateById(id: string, data: ISkills): Promise<ISkills> {
    try {
      await this.pool.query('BEGIN');

      const { operating_systems } = data;

      const queryForUpdate = {
        text: `UPDATE Skills 
        SET operating_systems = COALESCE($1, operating_systems) 
        WHERE skill_id = $2 
        RETURNING *`,
        values: [operating_systems, id],
      };

      const updatedSkill: ISkills = (await this.pool.query(queryForUpdate)).rows[0];
      if (!updatedSkill) throw new HttpException(404, ExceptionType.DB_SKILL_UPDATE_NOT_FOUND);

      await this.pool.query('COMMIT');

      return updatedSkill;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_SKILL_UPDATE_NOT_UPDATED);
    }
  }
}
