import { SuccessType } from '@/exceptions/exceptions.type';
import { ResumeDto } from '@/dto/resume.dto';
import ResumeService from '@/services/resume.service';
import { NextFunction, Request, Response } from 'express';
import { buildResponse } from '../helper/response';

class ResumeController {
  private resumeService = new ResumeService();

  uploadResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resume: ResumeDto = req.body;
      const uploadResume = await this.resumeService.save(resume);

      buildResponse(res, 201, uploadResume);
    } catch (error) {
      next(error);
    }
  };

  public downloadResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fileName: string = req.query.file as string;
      const filePath = await this.resumeService.download(fileName);

      res.status(200);
      res.download(filePath);
    } catch (error) {
      next(error);
    }
  };

  getResumes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resumes = await this.resumeService.getResumes();

      buildResponse(res, 200, resumes);
    } catch (error) {
      next(error);
    }
  };

  getResumeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resumeId = req.params.id;

      const resume = await this.resumeService.getResumeById(resumeId);

      buildResponse(res, 200, resume);
    } catch (error) {
      next(error);
    }
  };

  deleteResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.resumeService.delete(id);

      buildResponse(res, 200, SuccessType.RESUME_DELETED);
    } catch (error) {
      next(error);
    }
  };
}

export default ResumeController;
