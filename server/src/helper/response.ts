import { IEnvironment } from '@/database/Interfaces/index';
import { ResumeDto } from '@/dto/resume.dto';
import { Response } from 'express';

type message = string | string[] | IEnvironment[] | IEnvironment | ResumeDto | ResumeDto[];

const buildResponse = (res: Response, status: number, message: message): void => {
  res.status(status);
  res.send(message);
};

export { buildResponse };
