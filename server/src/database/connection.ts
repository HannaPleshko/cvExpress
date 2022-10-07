import { HttpException } from '@/exceptions/HttpException';
import { logger } from '@/utils/logger';
import { Client, Pool } from 'pg';
import { createTables } from './Queries/create_tables';
import { dropTables } from './Queries/drop_tables';
import { insertEnvironment } from './Queries/insert_environment';

const credentials = {
  user: process.env.USER_DB,
  host: process.env.HOST_DB,
  database: process.env.DATABASE,
  password: process.env.PASSWORD_DB,
  port: Number(process.env.PORT_DB),
};

export const defaultClient = new Client(credentials);

export const defaultPool = new Pool(credentials);

export class ConnectionDB {
  public client: Client;
  public pool: Pool;

  constructor(client: Client = defaultClient, pool: Pool = defaultPool) {
    this.client = client;
    this.pool = pool;
  }

  public async initializeDB(): Promise<void> {
    try {
      // await dropTables(this.pool);
      await createTables(this.pool);
      await insertEnvironment();

      logger.info(`Database initialization: success`);
    } catch (error) {
      const err: HttpException = error;
      logger.error(`Connection. initializeDB. ${err}`);
    }
  }
  public async dropAllTables(): Promise<void> {
    try {
      await dropTables(this.pool);
      logger.info(`Drop tables: success`);
    } catch (error) {
      const err: HttpException = error;
      logger.error(`Connection. dropAllTables. ${err}`);
    }
  }
}
