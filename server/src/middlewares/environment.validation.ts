import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { ExceptionType } from '../exceptions/exceptions.type';
import { validate } from 'class-validator';
import { IEnvironment } from '@/interfaces/environment.interface';

export const validateEnvironment =
  EnvironmentDto =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { body } = req;
      const environment: IEnvironment = new EnvironmentDto(body);
      const keys = Object.keys(body);

      const match = keys.every(el => Object.prototype.hasOwnProperty.call(environment, el));
      if (!match) throw new HttpException(400, ExceptionType.INVALID_ENVIRONMENT);

      const errors = await validate(environment);
      if (errors.length > 0) throw new HttpException(400, ExceptionType.INVALID_TYPE_ENVIRONMENT);

      next();
    } catch (err) {
      next(err);
    }
  };
