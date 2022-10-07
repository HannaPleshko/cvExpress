import { Pool } from 'pg';
import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@/exceptions/HttpException';
import { defaultPool } from './../connection';

export const dropTables = async (pool: Pool = defaultPool): Promise<void> => {
  try {
    const client = await pool.connect();
    await client.query('BEGIN');
    await client
      .query(
        `
        DROP TABLE IF EXISTS Experiences_Resume CASCADE;
        DROP TABLE IF EXISTS Projects_Experiences CASCADE;
        DROP TABLE IF EXISTS Environments_Projects CASCADE;
        DROP TABLE IF EXISTS Responsibilities_Projects CASCADE;
        DROP TABLE IF EXISTS Educations CASCADE;
        DROP TABLE IF EXISTS Resumes CASCADE;
        DROP TABLE IF EXISTS Environments CASCADE;
        DROP TABLE IF EXISTS Responsibilities CASCADE;
        DROP TABLE IF EXISTS Experiences CASCADE;
        DROP TABLE IF EXISTS Users CASCADE;
        DROP TABLE IF EXISTS Headers CASCADE;
      DROP TABLE IF EXISTS Projects CASCADE;
      DROP TABLE IF EXISTS Skills CASCADE;
      DROP TABLE IF EXISTS Skills_UserLanguages CASCADE;
      DROP TABLE IF EXISTS UserLanguages CASCADE;
      DROP TABLE IF EXISTS Companyes CASCADE;
      DO $$ BEGIN
          DROP TYPE operating_system_type CASCADE;
        EXCEPTION
          WHEN others THEN null;
      END $$;
      DO $$ BEGIN
          DROP TYPE environment_category_type CASCADE;
        EXCEPTION
          WHEN others THEN null;
      END $$;
      DO $$ BEGIN
          DROP TYPE position_type CASCADE;
        EXCEPTION
          WHEN others THEN null;
      END $$;
      DO $$ BEGIN
          DROP TYPE position_level_type CASCADE;
        EXCEPTION
          WHEN others THEN null;
      END $$;
      DO $$ BEGIN
          DROP TYPE base_languages_type CASCADE;
        EXCEPTION
          WHEN others THEN null;
      END $$;
      DO $$ BEGIN
          DROP TYPE base_levels_type CASCADE;
        EXCEPTION
          WHEN others THEN null;
      END $$;
    `,
      )
      .catch(error => {
        if (error) {
          throw new HttpException(500, ExceptionType.DB_DROP_NOT_DROPED);
        }
      });
    await client.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(500, ExceptionType.DB_DROP_NOT_CONNECTED);
  }
};
