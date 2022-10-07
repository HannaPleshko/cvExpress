import { ISkills } from '../Interfaces/index';
import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger';
import { DatabaseError } from 'pg';
import { Database } from '..';
import { ISkillUserLanguages, IUserLanguages } from '../Interfaces/index';

export class UserLangage_SkillDB extends Database {
  /**
   * CREATE Skill_UserLanguage column.
   * @param data The id's of user_language and skill
   * @returns {IUserLanguages} The Skill_UserLanguage column
   */
  async create(data: ISkillUserLanguages): Promise<ISkillUserLanguages> {
    try {
      await this.pool.query('BEGIN');

      const { user_language_id, skill_id } = data;

      const queryForGetUserLanguage = {
        text: 'SELECT * FROM UserLanguages WHERE user_language_id=$1',
        values: [user_language_id],
      };

      const userLanguage: IUserLanguages = (await this.pool.query(queryForGetUserLanguage)).rows[0];

      const queryForGetSkill = {
        text: 'SELECT * FROM Skills WHERE skill_id=$1',
        values: [skill_id],
      };

      const skill: ISkills = (await this.pool.query(queryForGetSkill)).rows[0];

      if (!userLanguage || !skill) {
        throw new HttpException(400, ExceptionType.DB_USERLANGUAGE_CREATE_NOT_FOUND);
      }

      const query = {
        text: 'INSERT INTO Skills_UserLanguages (user_language_id,skill_id) VALUES ($1,$2) RETURNING *',
        values: [user_language_id, skill_id],
      };

      const SkillUserLanguage: ISkillUserLanguages = (await this.pool.query(query)).rows[0];
      await this.pool.query('COMMIT');

      return SkillUserLanguage;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      if (err instanceof HttpException) throw err;

      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_SKILL_USERLANGUAGE_CREATE_NOT_CREATED);
    }
  }

  async getAll(): Promise<IUserLanguages[] | []> {
    try {
      const query = { text: 'SELECT * FROM Skills_UserLanguages ORDER BY skill_id' };

      const userLanguages: IUserLanguages[] | [] = (await this.pool.query(query)).rows;

      return userLanguages;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_SKILL_USERLANGUAGE_GET_ALL_NOT_GOT);
    }
  }

  async getById(id: string): Promise<IUserLanguages[] | undefined> {
    try {
      const query = { text: 'SELECT * from Skills_UserLanguages WHERE skill_id=$1', values: [id] };

      const userLanguage: IUserLanguages[] | undefined = (await this.pool.query(query)).rows;

      return userLanguage;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_SKILL_USERLANGUAGE_GET_BY_ID_NOT_GOT);
    }
  }

  /**
   * DELETE Skill_UserLanguage column.
   * @param data The id's of user_language and skill
   * @returns {boolean} That the column has been deleted
   */
  async deleteOne(data: ISkillUserLanguages): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');
      const query = {
        text: 'DELETE FROM Skills_UserLanguages WHERE user_language_id=$1 and skill_id=$2 ',
        values: [data.user_language_id, data.skill_id],
      };

      const deletedUserLanguage = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return deletedUserLanguage.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');

      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_SKILL_USERLANGUAGE_DELETE_ONE_NOT_DELETED);
    }
  }

  /**
   * DELETE Skill_userLanguage columns.
   * @param id The id of skill
   * @returns {boolean} The deleted Skill_UserLanguage columns
   */
  async deleteById(id: string): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');
      const query = { text: 'DELETE FROM Skills_UserLanguages WHERE skill_id=$1', values: [id] };

      const deletedUserLanguage = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return deletedUserLanguage.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_SKILL_USERLANGUAGE_DELETE_BY_ID_NOT_DELETED);
    }
  }
}
