import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@/utils/logger';
import { DatabaseError } from 'pg';
import { Database } from '..';
import { ICompany } from '../Interfaces';

export class CompanyDB extends Database {
  async create(data: ICompany): Promise<ICompany> {
    try {
      await this.pool.query('BEGIN');

      const { company } = data;

      const query = {
        text: 'INSERT INTO Companyes (company) VALUES ($1) RETURNING *',
        values: [company],
      };

      const newCompany: ICompany = (await this.pool.query(query)).rows[0];
      await this.pool.query('COMMIT');

      return newCompany;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_COMPANIES_CREATE_NOT_CREATED);
    }
  }

  async getAll(): Promise<ICompany[] | []> {
    try {
      const query = { text: 'SELECT * FROM Companyes' };

      const companies: ICompany[] = (await this.pool.query(query)).rows;

      return companies;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_COMPANIES_GET_ALL_NOT_GOT);
    }
  }

  async getById(id: string): Promise<ICompany | undefined> {
    try {
      const query = { text: 'SELECT * from Companyes WHERE company_id=$1', values: [id] };

      const result: ICompany = (await this.pool.query(query)).rows[0];

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_COMPANIES_GET_BY_ID_NOT_GOT);
    }
  }

  async getOne(company: string): Promise<ICompany | undefined> {
    try {
      const query = { text: 'SELECT * from Companyes WHERE company=$1', values: [company] };

      const result: ICompany | undefined = (await this.pool.query(query)).rows[0];

      return result;
    } catch (err) {
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_COMPANIES_GET_ONE_NOT_GOT);
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      await this.pool.query('BEGIN');
      const query = {
        text: 'DELETE FROM Companyes WHERE company_id=$1 RETURNING *',
        values: [id],
      };

      const deletedCompany = await this.pool.query(query);
      await this.pool.query('COMMIT');

      return deletedCompany.rowCount != 0 ? true : false;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_COMPANIES_DELETE_NOT_DELETED);
    }
  }

  async updateById(id: string, data: ICompany): Promise<ICompany> {
    try {
      await this.pool.query('BEGIN');
      const queryForGet = { text: 'SELECT * from Companyes WHERE company_id=$1', values: [id] };

      const foundCompany: ICompany = (await this.pool.query(queryForGet)).rows[0];
      if (!foundCompany) throw new HttpException(404, ExceptionType.DB_COMPANIES_UPDATE_COMPANY_NOT_FOUND);

      const { company } = data;

      const queryForUpdate = {
        text: 'UPDATE Companyes SET company=$1 WHERE company_id=$2 RETURNING *',
        values: [company, id],
      };

      const updatedCompany: ICompany = (await this.pool.query(queryForUpdate)).rows[0];
      await this.pool.query('COMMIT');

      return updatedCompany;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.DB_COMPANIES_UPDATE_NOT_UPDETED);
    }
  }
}
