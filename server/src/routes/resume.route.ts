import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import ResumeController from '@/controllers/resume.controller';

class ResumeRoute implements Routes {
  public path = '/resume';

  public router = Router();
  public resumeController = new ResumeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(`${this.path}/upload`, this.resumeController.uploadResume);
    this.router.get(`${this.path}/download`, this.resumeController.downloadResume);
    this.router.get(`${this.path}`, this.resumeController.getResumes);
    this.router.get(`${this.path}/:id`, this.resumeController.getResumeById);
    this.router.delete(`${this.path}/:id`, this.resumeController.deleteResume);
  }
}

export default ResumeRoute;
