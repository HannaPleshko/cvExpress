import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import EnvironmentController from '@controllers/environment.controller';
import { validateEnvironment } from '@middlewares/environment.validation';
import { CreateEnvironment, UpdateEnvironment } from './../dto/environment.dto';

class EnvironmentRoute implements Routes {
  public path = '/environment';

  public router = Router();
  public environmentController = new EnvironmentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, this.environmentController.getEnvironments);
    this.router.post(`${this.path}`, validateEnvironment(CreateEnvironment), this.environmentController.createEnvironment);
    this.router.patch(`${this.path}/:id`, validateEnvironment(UpdateEnvironment), this.environmentController.updateEnvironment);
    this.router.delete(`${this.path}/:id`, this.environmentController.deleteEnvironment);
  }
}

export default EnvironmentRoute;
