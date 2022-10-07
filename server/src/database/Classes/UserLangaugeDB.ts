import { BaseLevelType, BaseLanguageType } from './../Interfaces/index';
import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger';
import { DatabaseError } from 'pg';
import { Database } from '..';
import { IUserLanguages } from '../Interfaces/index';

export class UserLanguageDB extends Database {
  /**
   * CREATE UserLanguages column.
   * @param {IUserLanguages} data The client data object
   * @returns {IUserLanguages} The created UserLanguages column
   */
  async create(data: IUserLanguages): Promise<IUserLanguages> {
    try {
      await this.pool.query('BEGIN');
      const { base_language, base_level } = data;

      const query = {
        text: 'INSERT INTO UserLanguages (base_language, base_level) VALUES ($1, $2) RETURNING *',
        values: [base_language, base_level],
      };

      const userLanguage: IUserLanguages = (await this.pool.query(query)).rows[0];
      await this.pool.query('COMMIT');

      return userLanguage;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      if (err instanceof HttpException) throw err;

      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_USERLANGUAGE_CREATE_NOT_CREATED);
    }
  }

  async getAll(): Promise<IUserLanguages[] | []> {
    try {
      const query = { text: 'SELECT * FROM UserLanguages' };

      const userLanguages: IUserLanguages[] | [] = (await this.pool.query(query)).rows;

      return userLanguages;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_USERLANGUAGE_GET_ALL_NOT_GOT);
    }
  }

  /**
   * GET UserLanguages column by Id (skill_id).
   * @param {string} id The id of skill_id
   * @returns {IUserLanguages[] | undefined} The UserLanguage column
   */
  async getById(id: string): Promise<IUserLanguages | undefined> {
    try {
      const query = { text: 'SELECT * from UserLanguages WHERE user_language_id=$1', values: [id] };

      const userLanguage: IUserLanguages | undefined = (await this.pool.query(query)).rows[0];

      return userLanguage;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_USERLANGUAGE_GET_BY_ID_NOT_GOT);
    }
  }

  /**
   * GET UserLanguages column by base_level and base_language.
   * @param {string} id The base_level and base_language
   * @returns {IUserLanguages[] | undefined} The UserLanguage column
   */
  async getOneByLevelAndLanguage(base_level: BaseLevelType, base_language: BaseLanguageType): Promise<IUserLanguages | undefined> {
    try {
      const query = { text: 'SELECT * from UserLanguages WHERE base_level=$1 and base_language=$2', values: [base_level, base_language] };

      const userLanguage: IUserLanguages | undefined = (await this.pool.query(query)).rows[0];

      return userLanguage;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_USERLANGUAGE_GET_BY_ID_NOT_GOT);
    }
  }

  /**
   * DELETE UserLanguages column by Id (user_language_id).
   * @param {string} id The id of user_language_id
   * @returns {boolean} That the column has been deleted
   */
  async deleteById(id: string): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');
      const query = { text: 'DELETE FROM UserLanguages WHERE user_language_id=$1', values: [id] };

      const deletedUserLanguage = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return deletedUserLanguage.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_USERLANGUAGE_DELETE_NOT_DELETED);
    }
  }
}
