import { SuccessType } from '@/exceptions/exceptions.type';
import { NextFunction, Request, Response } from 'express';
import EnvironmentService from '@/services/environment.service';
import { CreateEnvironment, UpdateEnvironment } from './../dto/environment.dto';
import { buildResponse } from '../helper/response';

class EnvironmentController {
  private environmentService = new EnvironmentService();

  getEnvironments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dataEnvironment = await this.environmentService.getEnvironments();

      buildResponse(res, 200, dataEnvironment);
    } catch (error) {
      next(error);
    }
  };

  createEnvironment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const environment: CreateEnvironment = req.body;
      const created = await this.environmentService.saveEnvironment(environment);

      buildResponse(res, 201, created);
    } catch (error) {
      next(error);
    }
  };

  updateEnvironment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const environment: UpdateEnvironment = req.body;
      const updated = await this.environmentService.updateEnvironment(id, environment);

      buildResponse(res, 200, updated);
    } catch (error) {
      next(error);
    }
  };

  deleteEnvironment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.environmentService.deleteEnvironment(id);

      buildResponse(res, 200, SuccessType.ENVIRONMENT_DELETED);
    } catch (error) {
      next(error);
    }
  };
}

export default EnvironmentController;
