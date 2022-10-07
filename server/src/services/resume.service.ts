import { ResumeHeader } from '@/dto/resume.dto';
import { HttpException } from './../exceptions/HttpException';
import { IResumeService } from './../interfaces/services.interface';
import { ResumeDto } from './../dto/resume.dto';
import fs from 'fs/promises';
import path from 'path';
import ConversionService from './conversion.service';
import { ExceptionType } from '@/exceptions/exceptions.type';
import { ResumeDB } from '../database/Classes/ResumeDb';
import { UserDB } from '../database/Classes/UserDb';
import { HeaderDB } from '../database/Classes/HeaderDB';
import { defaultClient as client, defaultPool as pool } from '../database/connection';
import { ResumeFasade } from '@/database/ResumeFasade';
import { IResume } from '@/database/Interfaces';

class ResumeService implements IResumeService {
  private resumeFasade = new ResumeFasade(client, pool);
  private resume = new ResumeDB(client, pool);
  private user = new UserDB(client, pool);
  private header = new HeaderDB(client, pool);

  conversionService: ConversionService;

  async save(resumeDto: ResumeDto): Promise<string> {
    try {
      const { firstName, lastName } = resumeDto.header;
      //TODO
      let user = await this.user.getByName(firstName, lastName);
      if (!user) {
        user = await this.user.create({ firstname: firstName, lastname: lastName });
      }

      const previousHeader = await this.header.getByUserId(user.header_id);

      if (
        !previousHeader ||
        previousHeader.position_level !== resumeDto.header.positionLevel ||
        previousHeader.user_position !== resumeDto.header.userPosition ||
        previousHeader.profiles.toString() !== resumeDto.header.profile.toString()
      ) {
        const headerDto: ResumeHeader = {
          lastName: user.lastname,
          firstName: user.firstname,
          profile: resumeDto.header.profile,
          positionLevel: resumeDto.header.positionLevel,
          userPosition: resumeDto.header.userPosition,
        };

        if (previousHeader) {
          await this.header.deleteById(previousHeader.header_id);
        }
        await this.resumeFasade.addHeaderToUser(user.user_id, headerDto);
      }

      const resume_id = await this.resumeFasade.addResumeToUser(user.user_id, resumeDto);

      return resume_id;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log(error);

      throw new HttpException(500, ExceptionType.RESUME_SAVE_NOT_SAVED);
    }
  }

  createFileName(fileName: string): string {
    return `${fileName.replaceAll(' ', '')}.doc`;
  }

  async getResumes(): Promise<ResumeDto[]> {
    try {
      const resumesIdsFromDb: IResume[] = await this.resume.getAll();
      const resumes: ResumeDto[] = await Promise.all(resumesIdsFromDb.map(async ({ resume_id }) => await this.resumeFasade.getResumeById(resume_id)));

      return resumes;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(500, ExceptionType.RESUME_GET_RESUMES_NOT_GOT);
    }
  }

  async getResumeById(resumeId: string): Promise<ResumeDto> {
    try {
      const resume = await this.resumeFasade.getResumeById(resumeId);

      return resume;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(500, ExceptionType.RESUME_GET_RESUME_BY_ID_NOT_GOT);
    }
  }

  public async download(fileName: string): Promise<string> {
    try {
      const folder = process.env.STORAGE;
      const pathStorage = path.join(path.resolve(), folder);
      const files = await fs.readdir(pathStorage);

      const file = files.filter(item => item === fileName)[0];
      if (!file) throw new HttpException(404, ExceptionType.RESUME_DOWNLOAD_NOT_FOUND);

      const pathToFile = path.join(path.resolve(), folder, file);

      return pathToFile;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(500, ExceptionType.RESUME_DOWNLOAD_NOT_DOWNLOADED);
    }
  }

  public async delete(resume_id: string): Promise<void> {
    try {
      const deletedResume = await this.resumeFasade.deleteResume(resume_id);
      if (!deletedResume) throw new HttpException(500, ExceptionType.DB_RESUME_NOT_DELETED);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new HttpException(500, ExceptionType.DB_RESUME_NOT_DELETED);
    }
  }
}
export default ResumeService;
