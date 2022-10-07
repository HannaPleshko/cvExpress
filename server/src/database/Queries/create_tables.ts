import { Pool } from 'pg';
import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@/exceptions/HttpException';
import { defaultPool } from '../connection';

export const createTables = async (pool: Pool = defaultPool): Promise<void> => {
  try {
    const client = await pool.connect();
    await client.query('BEGIN');
    await client
      .query(
        `
        
DO $$ BEGIN
    CREATE TYPE position_type AS ENUM (
      'Software Engineer',
      'CEO', 'Team Lead',
      'Enterprise Architect',
      'Project Manager',
      'Delivery Manager',
      'Software Engineer',
      'Business Analyst',
      'QA Engineer',
      'DevOps Engineer',
      'DB Administrator',
      'UI/UX Specialist'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE position_level_type AS ENUM (
  'Trainee', 'Junior', 'Middle', 'Senior', 'Lead'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE operating_system_type AS ENUM ('Windows', 'Mac OS', 'Linux', 'iOS', 'Android');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE environment_category_type AS ENUM ('programmingLanguages', 'applicationServers', 'databases', 'webTechnologies', 'otherSkills');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE responsibility_category_type AS ENUM (
    'Software Engineer',
    'CEO', 'Team Lead',
    'Enterprise Architect',
    'Project Manager',
    'Delivery Manager',
    'Software Engineer',
    'Business Analyst',
    'QA Engineer',
    'DevOps Engineer',
    'DB Administrator',
    'UI/UX Specialist');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE base_languages_type AS ENUM (
    'English',
    'Polish',
    'German',
    'Russian',
    'French',
    'Chinese');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE base_levels_type AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS UserLanguages (

    user_language_id    UUID     DEFAULT MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT)::UUID,
    base_language    base_languages_type     NOT NULL ,
    base_level       base_levels_type     NOT NULL,

    PRIMARY KEY(user_language_id)
);

 CREATE TABLE IF NOT EXISTS Skills (
    skill_id             UUID DEFAULT MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT)::UUID,
    operating_systems    operating_system_type[]   NOT NULL,

	  PRIMARY KEY(skill_id)
);

CREATE TABLE IF NOT EXISTS  Skills_UserLanguages (
    skills_user_languages_id  UUID  DEFAULT MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT)::UUID,
	  user_language_id          UUID  NOT NULL,
    skill_id                  UUID  NOT NULL,

    CONSTRAINT fk_skill
      FOREIGN KEY(skill_id)
	      REFERENCES Skills(skill_id)
          ON DELETE CASCADE,

    CONSTRAINT fk_user_language
      FOREIGN KEY(user_language_id)
	      REFERENCES UserLanguages(user_language_id)
          ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Projects (
  project_id        UUID          DEFAULT MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT)::UUID,
  description       TEXT          NOT NULL,
  user_position     position_type	 NOT NULL,
  position_level    position_level_type,

  PRIMARY KEY(project_id)
);

CREATE TABLE IF NOT EXISTS Environments (
    environment_id  UUID 		       DEFAULT MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT)::UUID,
    label     varchar(50)    NOT NULL UNIQUE,
    category        environment_category_type           NOT NULL,
    priority        int           NOT NULL,

    PRIMARY KEY(environment_id)
);

CREATE TABLE IF NOT EXISTS Responsibilities (
    responsibility_id  UUID           DEFAULT MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT)::UUID,
    label text NOT NULL,
    category responsibility_category_type    NOT NULL,
    priority SMALLINT    NOT NULL,

    PRIMARY KEY(responsibility_id)
);

CREATE TABLE IF NOT EXISTS Companyes (
    company_id  UUID            DEFAULT MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT)::UUID,
    company     varchar(100)    NOT NULL UNIQUE,

    PRIMARY KEY(company_id)
);

CREATE TABLE IF NOT EXISTS Experiences (

    experience_id     UUID    DEFAULT MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT)::UUID,
    start_date         DATE    NOT NULL,
    end_date           DATE,
	  company_id        UUID    NOT NULL,
	  user_position     position_type	    NOT NULL,
    position_level    position_level_type,
    PRIMARY KEY(experience_id),

    CONSTRAINT fk_company
      FOREIGN KEY(company_id)
        REFERENCES Companyes(company_id)
         ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Headers (

    header_id   UUID    DEFAULT MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT)::UUID,
	  user_position		position_type			NOT NULL,
	  position_level    position_level_type,
    profiles text[]    NOT NULL ,

    PRIMARY KEY(header_id)
);

CREATE TABLE IF NOT EXISTS Users (

    user_id       UUID DEFAULT MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT)::UUID,
	  firstName     varchar(25)   NOT NULL,
	  lastName      varchar(25)   NOT NULL,
    header_id     UUID,

    PRIMARY KEY(user_id),
        
    FOREIGN KEY(header_id)
      REFERENCES Headers(header_id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Resumes (

    resume_id       UUID    DEFAULT MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT)::UUID,
    skill_id        UUID    NOT NULL,
    user_id         UUID    NOT NULL,
    fileName        text   NOT NULL,

    PRIMARY KEY(resume_id),
    
    CONSTRAINT fk_skill
      FOREIGN KEY(skill_id)
        REFERENCES Skills(skill_id)
          ON DELETE CASCADE,

    CONSTRAINT fk_user
      FOREIGN KEY(user_id)
        REFERENCES Users(user_id)
          ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Educations (
    education_id  UUID    DEFAULT MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT)::UUID,
    education     text    NOT NULL,
    resume_id     UUID    NOT NULL,

    PRIMARY KEY(education_id),

     CONSTRAINT fk_resume
      FOREIGN KEY(resume_id)
        REFERENCES Resumes(resume_id)
          ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS  Experiences_Resume (
  experiences_resume_id  UUID  DEFAULT MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT)::UUID,
  resume_id              UUID  NOT NULL,
  experience_id          UUID  NOT NULL,

  CONSTRAINT fk_resume
    FOREIGN KEY(resume_id)
      REFERENCES Resumes(resume_id)
       ON DELETE CASCADE,

  CONSTRAINT fk_experience
    FOREIGN KEY(experience_id)
      REFERENCES Experiences(experience_id)
       ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS  Projects_Experiences (
  projects_experiences_id  UUID    DEFAULT MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT)::UUID,
  project_id               UUID  NOT NULL,
  experience_id            UUID  NOT NULL,

  CONSTRAINT fk_project
    FOREIGN KEY(project_id)
      REFERENCES Projects(project_id)
        ON DELETE CASCADE,

  CONSTRAINT fk_experience
    FOREIGN KEY(experience_id)
      REFERENCES Experiences(experience_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS  Environments_Projects (
  environments_projects_id  UUID    DEFAULT MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT)::UUID,
  project_id                UUID  NOT NULL,
  environment_id            UUID  NOT NULL,

  CONSTRAINT fk_project
    FOREIGN KEY(project_id)
      REFERENCES Projects(project_id)
        ON DELETE CASCADE,

  CONSTRAINT fk_environment
    FOREIGN KEY(environment_id)
      REFERENCES Environments(environment_id)
       ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS  Responsibilities_Projects (
  responsibilities_projects_id  UUID    DEFAULT MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT)::UUID,
  project_id                    UUID  NOT NULL,
  responsibility_id             UUID  NOT NULL,

  CONSTRAINT fk_project
    FOREIGN KEY(project_id)
      REFERENCES Projects(project_id)
       ON DELETE CASCADE,

  CONSTRAINT fk_responsibility_id
    FOREIGN KEY(responsibility_id)
      REFERENCES Responsibilities(responsibility_id)
       ON DELETE CASCADE
);

`,
      )
      .catch(error => {
        if (error) {
          console.log(error);

          throw new HttpException(500, ExceptionType.DB_INITIALIZE_NOT_INITIALIZED);
        }
      });
    await client.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    if (error instanceof HttpException) throw error;

    throw new HttpException(500, ExceptionType.DB_INITIALIZE_NOT_CONNECTED);
  }
};
