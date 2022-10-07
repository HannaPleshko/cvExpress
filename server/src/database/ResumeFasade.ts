import { PositionLevelType, IHeader, BaseLevelType, BaseLanguageType, IProjectExperience, IExperienceResume } from './Interfaces/index';
import { ResumeDto, ResumeHeader, Projects, ResumeExperience, ResumeSkills, Languages, Environments } from '@/dto/resume.dto';
import { HeaderDB } from './Classes/HeaderDB';
import { EducationDB } from './Classes/EducationDB';
import { CompanyDB } from './Classes/CompanyDB';
import { UserDB } from './Classes/UserDb';
import { ResumeDB } from './Classes/ResumeDb';
import { ExperienceResumeDB } from './Classes/ExperienceResumeDB';
import { ExperienceDb } from './Classes/ExperienceDb';
import { Project_ExperienceDB } from './Classes/Project_ExperienceDB';
import { ProjectDB } from './Classes/ProjectDB';
import { SkillsDB } from './Classes/SkillsDB';
import { Client, DatabaseError, Pool } from 'pg';
import { EnvironmentDB } from './Classes/EnvironmentDB';
import { ResponsibilityDB } from './Classes/ResponsibilityDB';
import { UserLangage_SkillDB } from './Classes/UserLangage_SkillDB';
import { UserLanguageDB } from './Classes/UserLangaugeDB';
import { ExceptionType } from '@/exceptions/exceptions.type';
import { logger } from '@/utils/logger';
import { HttpException } from '@/exceptions/HttpException';
import { PositionType } from './Interfaces';
import { ResponsibilityProjectDB } from './Classes/ResponsibilityProjectDB';
import { EnvironmentProjectDB } from './Classes/EnvironmentProjectDB';

interface IPosition {
  position_level: PositionLevelType | null;
  user_position: PositionType;
}

export class ResumeFasade {
  public client: Client;
  public pool: Pool;
  public envDB: EnvironmentDB;
  public resDB: ResponsibilityDB;
  public resProjectDB: ResponsibilityProjectDB;
  public envProjectDB: EnvironmentProjectDB;
  public userLanguageDB: UserLanguageDB;
  public userSkillDB: UserLangage_SkillDB;
  public skillDB: SkillsDB;
  public projectDB: ProjectDB;
  public projectExperienceDB: Project_ExperienceDB;
  public experienceDB: ExperienceDb;
  public experienceResumeDB: ExperienceResumeDB;
  public resumeDB: ResumeDB;
  public userDB: UserDB;
  public companyDB: CompanyDB;
  public educationDB: EducationDB;
  public headerDB: HeaderDB;

  constructor(client: Client, pool: Pool) {
    this.client = client;
    this.pool = pool;
    this.envDB = new EnvironmentDB(client, pool);
    this.resDB = new ResponsibilityDB(client, pool);
    this.resProjectDB = new ResponsibilityProjectDB(client, pool);
    this.envProjectDB = new EnvironmentProjectDB(client, pool);
    this.userLanguageDB = new UserLanguageDB(client, pool);
    this.userSkillDB = new UserLangage_SkillDB(client, pool);
    this.skillDB = new SkillsDB(client, pool);
    this.projectDB = new ProjectDB(client, pool);
    this.projectExperienceDB = new Project_ExperienceDB(client, pool);
    this.experienceDB = new ExperienceDb(client, pool);
    this.experienceResumeDB = new ExperienceResumeDB(client, pool);
    this.resumeDB = new ResumeDB(client, pool);
    this.userDB = new UserDB(client, pool);
    this.companyDB = new CompanyDB(client, pool);
    this.educationDB = new EducationDB(client, pool);
    this.headerDB = new HeaderDB(client, pool);
  }

  public async addUserLanguages(languages: Languages[]): Promise<string[]> {
    return await Promise.all(
      languages.map(async data => {
        const level = data.level as BaseLevelType;
        const language = data.language as BaseLanguageType;

        const previousUserLanguages = await this.userLanguageDB.getOneByLevelAndLanguage(level, language);

        if (!previousUserLanguages) {
          const newUserLanguage = await this.userLanguageDB.create({
            base_language: language,
            base_level: level,
          });
          return newUserLanguage.user_language_id;
        }

        return previousUserLanguages.user_language_id;
      }),
    );
  }

  public async addResumeToUser(user_id: string, data: ResumeDto): Promise<string> {
    try {
      await this.pool.query('BEGIN');
      const user = await this.userDB.getById(user_id);

      if (!user) {
        throw new HttpException(404, ExceptionType.RESUME_FASADE_ADD_RESUME_TO_USER_USER_NOT_FOUND);
      }

      //array of userLanguage Ids
      const allUserLanguagesIds = await this.addUserLanguages(data.skills.languages);

      if (!allUserLanguagesIds) {
        throw new HttpException(400, ExceptionType.RESUME_FASADE_ADD_RESUME_TO_USER_DATA_INCORRECT);
      }

      //added skill column with operating systems
      const operating_systems = data.skills.operatingSystems;
      const { skill_id } = await this.skillDB.create({ operating_systems });

      //added userLanguageSkill columns
      allUserLanguagesIds.map(async user_language_id => {
        await this.userSkillDB.create({ skill_id, user_language_id: user_language_id });
      });

      //add resume column
      const resume = await this.resumeDB.create({ user_id: user.user_id, skill_id, filename: data.filename });

      //add experience and other lower columns
      const experienceIds = await this.addExperience(data.experience);

      //add educations columns
      data.education.map(async education => {
        await this.educationDB.create({ education, resume_id: resume.resume_id });
      });

      experienceIds.map(async experience_id => {
        await this.experienceResumeDB.create({ experience_id, resume_id: resume.resume_id });
      });

      await this.pool.query('COMMIT');

      return resume.resume_id;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      if (err instanceof HttpException) throw err;

      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.RESUME_FASADE_ADD_RESUME_TO_USER_NOT_ADD);
    }
  }

  public async addExperience(experiences: ResumeExperience[]): Promise<string[]> {
    return await Promise.all(
      experiences.map(async experience => {
        //check if company exist
        const gotCompany = await this.companyDB.getOne(experience.companyName);

        //add company column to each experience
        const { company_id } = gotCompany ?? (await this.companyDB.create({ company: experience.companyName }));
        const { userPosition, positionLevel } = experience;

        //add experience column
        const createdExperience = await this.experienceDB.create({
          user_position: userPosition,
          position_level: positionLevel,
          company_id: company_id,
          start_date: new Date(experience.startDate),
          end_date: experience.endDate ? new Date(experience.endDate) : null,
        });

        // add project columns
        await this.addProjects(createdExperience.experience_id, experience.projects);

        return createdExperience.experience_id;
      }),
    );
  }

  public async addProjects(experience_id: string, projects: Projects[]): Promise<void> {
    await Promise.all(
      projects.map(async project => {
        const { project_id } = await this.projectDB.create({
          user_position: project.userPosition,
          position_level: project.positionLevel,
          description: project.description,
        });

        //add environments for our project
        await this.addEnvironments(project_id, project.environment);

        //add responsibilities for our project
        await this.addResponsibilities(project_id, project.responsibilities);

        await this.projectExperienceDB.create({ project_id: project_id, experience_id });
      }),
    );
  }

  public async addResponsibilities(project_id: string, responsibilities: string[]): Promise<void> {
    await Promise.all(
      responsibilities.map(async responsibility => {
        let ourResponsibility = await this.resDB.getByResponsibility(responsibility);

        if (!ourResponsibility) {
          ourResponsibility = await this.resDB.create({
            responsibility,
          });
        }

        const existResProject = await this.resProjectDB.getOne(project_id, ourResponsibility.responsibility_id);

        if (!existResProject) {
          await this.resProjectDB.create({ responsibility_id: ourResponsibility.responsibility_id, project_id });
        }
      }),
    );
  }

  public async addEnvironments(project_id: string, environments: Environments[]): Promise<void> {
    await Promise.all(
      environments.map(async environment => {
        const { environment_id } = await this.envDB.getByEnvironment(environment.label);

        const existEnvProject = await this.envProjectDB.getOne(project_id, environment_id);

        if (!existEnvProject) {
          await this.envProjectDB.create({ environment_id: environment_id, project_id });
        }
      }),
    );
  }

  public async addHeaderToUser(user_id: string, data: ResumeHeader): Promise<string> {
    try {
      const user = await this.userDB.getById(user_id);

      if (!user) {
        throw new HttpException(404, ExceptionType.RESUME_FASADE_ADD_HEADER_TO_USER_NOT_USER_NOT_FOUND);
      }

      const { positionLevel, userPosition } = data;

      const dto: IHeader = { profiles: data.profile, user_position: userPosition, position_level: positionLevel };

      const { header_id } = await this.headerDB.create(dto);

      const result = await this.userDB.updateById(user_id, { header_id });

      await this.pool.query('COMMIT');

      return result.header_id;
    } catch (err) {
      await this.pool.query('ROLLBACK');
      if (err instanceof HttpException) throw err;

      const error: DatabaseError = err;
      logger.error(`Message: ${error.message}. Detail: ${error.detail}`);

      throw new HttpException(500, ExceptionType.RESUME_FASADE_ADD_HEADER_TO_USER_NOT_ADD);
    }
  }

  public async getResumeById(resume_id: string): Promise<ResumeDto> {
    try {
      const resumeDto: ResumeDto = {
        id: '',
        filename: '',
        header: {
          firstName: '',
          lastName: '',
          userPosition: null,
          positionLevel: null,
          profile: [],
        },
        skills: {
          operatingSystems: [],
          languages: [],
        },
        experience: [],
        education: [],
      };

      const resume = await this.resumeDB.getById(resume_id);

      resumeDto.id = resume.resume_id;
      resumeDto.filename = resume.filename;

      resumeDto.skills = await this.getSkill(resume.skill_id);

      const educations = await this.educationDB.getAllByResumeId(resume_id);

      educations.map(({ education }) => {
        resumeDto.education.push(education);
      });

      resumeDto.header = await this.getHeader(resume.user_id);

      const experiencesResume = await this.experienceResumeDB.getById(resume_id);
      resumeDto.experience = await this.getExperiences(experiencesResume);

      return resumeDto;
    } catch (error) {
      console.log(error);
    }
  }

  public async getSkill(skill_id: string): Promise<ResumeSkills> {
    const resume_skill: ResumeSkills = {
      operatingSystems: [],
      languages: [],
    };

    const { operating_systems } = await this.skillDB.getById(skill_id);
    const operatingSystemsArray = operating_systems
      .replace(/\{?['"]?\}?/g, '')
      .split(',')
      .map(item => item.trim());

    resume_skill.operatingSystems = operatingSystemsArray;

    const userLanguagesSkill = await this.userSkillDB.getById(skill_id);

    const userLanguagesIds = userLanguagesSkill.map(({ user_language_id }) => user_language_id);

    await Promise.all(
      userLanguagesIds.map(async user_language_id => {
        const { base_level, base_language } = await this.userLanguageDB.getById(user_language_id);

        resume_skill.languages.push({ language: base_language, level: base_level });
      }),
    );
    return resume_skill;
  }

  public async getHeader(user_id: string): Promise<ResumeHeader> {
    const resume_header: ResumeHeader = {
      firstName: '',
      lastName: '',
      userPosition: null,
      positionLevel: null,
      profile: [],
    };

    const user = await this.userDB.getById(user_id);
    const header = await this.headerDB.getById(user.header_id);

    resume_header.firstName = user.firstname;
    resume_header.lastName = user.lastname;
    resume_header.positionLevel = header.position_level;
    resume_header.userPosition = header.user_position;
    resume_header.profile = header.profiles;

    return resume_header;
  }

  public async getProjects(projectsExperienceIds: IProjectExperience[]): Promise<Projects[]> {
    const projects: Projects[] = [];

    await Promise.all(
      projectsExperienceIds.map(async ({ project_id }) => {
        const project = await this.projectDB.getById(project_id);

        const envProject = await this.envProjectDB.getById(project_id);
        const resProject = await this.resProjectDB.getById(project_id);

        const environments = [];
        const responsibilities = [];

        await Promise.all(
          envProject.map(async ({ environment_id }) => {
            const { label } = await this.envDB.getById(environment_id);
            environments.push(label);
          }),
        );

        await Promise.all(
          resProject.map(async ({ responsibility_id }) => {
            const { responsibility } = await this.resDB.getById(responsibility_id);
            responsibilities.push(responsibility);
          }),
        );

        projects.push({
          positionLevel: project.position_level,
          userPosition: project.user_position,
          description: project.description,
          responsibilities,
          environment: environments,
        });
      }),
    );
    return projects;
  }

  public async getExperiences(experiencesResumeIds: IExperienceResume[]): Promise<ResumeExperience[]> {
    const resume_experiences = [] as ResumeExperience[];
    await Promise.all(
      experiencesResumeIds.map(async ({ experience_id }) => {
        const experience = await this.experienceDB.getById(experience_id);

        const projectsExperience = await this.projectExperienceDB.getById(experience_id);

        const projectsDto = await this.getProjects(projectsExperience);

        const { company } = await this.companyDB.getById(experience.company_id);

        resume_experiences.push({
          positionLevel: experience.position_level,
          userPosition: experience.user_position,
          companyName: company,
          endDate: experience.end_date,
          startDate: experience.start_date,
          projects: projectsDto,
        });
      }),
    );

    return resume_experiences;
  }

  public convertPosition(position: string | undefined): IPosition | undefined {
    const levels = ['Lead', 'Senior', 'Middle', 'Junior'];
    const result = levels.map(level => {
      if (position.indexOf(level) !== -1) {
        const pos = position.slice(position.indexOf(level) + level.length + 1) as PositionType;
        const lvl = position.slice(position.indexOf(level), position.indexOf(level) + level.length) as PositionLevelType;
        return { user_position: pos, position_level: lvl };
      }
    })[0];

    if (!result) {
      const pos = position as PositionType;
      return { user_position: pos, position_level: null };
    }

    return result;
  }

  public async deleteResume(resume_id): Promise<Boolean> {
    try {
      await this.pool.query('BEGIN');

      const resume = await this.resumeDB.getById(resume_id);
      if (!resume) throw new HttpException(500, ExceptionType.RESUME_DELETE_NOT_FOUND);

      const experienceResumes = await this.experienceResumeDB.getById(resume_id);
      if (experienceResumes.length) await this.findProjectExperience(experienceResumes);

      await this.skillDB.deleteById(resume.skill_id);

      await this.pool.query('COMMIT');
      return true;
    } catch (error) {
      await this.pool.query('ROLLBACK');
      if (error instanceof HttpException) throw error;

      throw new HttpException(500, ExceptionType.DB_RESUME_NOT_DELETED);
    }
  }

  public async findProjectExperience(experiencesResumes: IExperienceResume[]): Promise<void> {
    await Promise.all(
      experiencesResumes.map(async experienceResume => {
        const projectExperiences = await this.projectExperienceDB.getById(experienceResume.experience_id);

        await this.experienceDB.deleteById(experienceResume.experience_id);
        if (projectExperiences) {
          await this.deleteProject(projectExperiences);
        }
      }),
    );
  }

  public async deleteProject(projectExperiences: IProjectExperience[]): Promise<void> {
    await Promise.all(
      projectExperiences.map(async projectExperience => {
        await this.projectDB.deleteById(projectExperience.project_id);
      }),
    );
  }
}
