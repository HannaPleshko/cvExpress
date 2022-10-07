import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from './../exceptions/HttpException';
import { logger } from '@utils/logger';
import { CreateEnvironment, UpdateEnvironment } from './../dto/environment.dto';
import { EnvironmentDB } from '../database/Classes/EnvironmentDB';
import { defaultClient as client, defaultPool as pool } from '../database/connection';
import { IEnvironment } from '../database/Interfaces/index';

class EnvironmentService {
  private environmentDB = new EnvironmentDB(client, pool);

  async getEnvironments(): Promise<IEnvironment[]> {
    const environments = await this.environmentDB.getAll();
    return environments;
  }

  async saveEnvironment(environment: CreateEnvironment): Promise<IEnvironment> {
    try {
      const createdEnvironment = await this.environmentDB.create(environment);

      logger.info(`New environment label: ${environment.label} saved`);

      return createdEnvironment;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      logger.error(`Environment.Service. ReadEnvironmentFile. ${error}`);
      throw new HttpException(500, ExceptionType.ENVIRONMENT_SAVE_DOES_NOT_SAVED);
    }
  }

  async updateEnvironment(id: string, environment: UpdateEnvironment): Promise<IEnvironment> {
    try {
      const updatedEnvironment = await this.environmentDB.updateById(id, environment);
      if (!updatedEnvironment) throw new HttpException(404, ExceptionType.ENVIRONMENT_UPDATE_SKILL_NOT_FOUND);

      logger.info(`Update environment id: ${id} updated`);

      return updatedEnvironment;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      logger.error(`Environment.Service. updateEnvironment. ${error}`);
      throw new HttpException(500, ExceptionType.ENVIRONMENT_UPDATE_SKILL_NOT_UPDATED);
    }
  }

  async deleteEnvironment(id: string): Promise<void> {
    try {
      const deletedEnvironment = await this.environmentDB.deleteById(id);
      if (!deletedEnvironment) throw new HttpException(404, ExceptionType.ENVIRONMENT_DELETE_SKILL_NOT_FOUND);

      logger.info(`Delete environment id: ${id} deleted`);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      logger.error(`Environment.Service. updateEnvironment. ${error}`);
      throw new HttpException(500, ExceptionType.ENVIRONMENT_DELETE_SKILL_NOT_DELETE);
    }
  }

  getSkillsByIds(ids: string[]): IEnvironment[] {
    const skills: IEnvironment[] = [];
    return skills;
    ids; //used for avoid TS error
  }
}

export default EnvironmentService;
