import { NextFunction, Request, Response } from 'express';
import { ExceptionType } from '@/exceptions/exceptions.type';
import { HttpException } from '@exceptions/HttpException';
import { validateEnvironment } from '@middlewares/environment.validation';
import { CreateEnvironment, UpdateEnvironment } from '../../dto/environment.dto';
import { Priority } from '@/interfaces/environment.interface';

describe('Testing the environment validation', () => {
  let errorResponse: Partial<HttpException>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const mockNextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = { body: {} };
    mockResponse = {
      json: jest.fn(),
    };
    errorResponse = jest.fn();
  });

  describe('CreateEnvironment', () => {
    it('should call the next function without error.', async () => {
      mockRequest.body = { label: 'label', category: 'programmingLanguages', priority: Priority.LOW };

      await validateEnvironment(CreateEnvironment)(mockRequest as Request, mockResponse as Response, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });

    it('should call the next function for the environment with invalid types.', async () => {
      mockRequest.body = { label: 'label', category: 'programmingLanguages', priority: '1' };
      errorResponse = new HttpException(400, ExceptionType.INVALID_TYPE_ENVIRONMENT);

      await validateEnvironment(CreateEnvironment)(mockRequest as Request, mockResponse as Response, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalledWith(errorResponse);
    });

    it('should call the next function for the environment with invalid keys.', async () => {
      mockRequest.body = { test: 'label', category: 'programmingLanguages', priority: Priority.LOW };
      errorResponse = new HttpException(400, ExceptionType.INVALID_ENVIRONMENT);

      await validateEnvironment(CreateEnvironment)(mockRequest as Request, mockResponse as Response, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalledWith(errorResponse);
    });

    it('should call the next function for the environment with invalid object length that does not match dto.', async () => {
      mockRequest.body = { category: 'programmingLanguages', priority: Priority.LOW };
      errorResponse = new HttpException(400, ExceptionType.INVALID_TYPE_ENVIRONMENT);

      await validateEnvironment(CreateEnvironment)(mockRequest as Request, mockResponse as Response, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalledWith(errorResponse);
    });
  });

  describe('UpdateEnvironment', () => {
    it('should call the next function without error.', async () => {
      mockRequest.body = { label: 'label', category: 'programmingLanguages', priority: Priority.LOW };

      await validateEnvironment(UpdateEnvironment)(mockRequest as Request, mockResponse as Response, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });

    it('should call the next function for the environment with invalid types.', async () => {
      mockRequest.body = { label: 'label', category: 'programmingLanguages', priority: '1' };
      errorResponse = new HttpException(400, ExceptionType.INVALID_TYPE_ENVIRONMENT);

      await validateEnvironment(UpdateEnvironment)(mockRequest as Request, mockResponse as Response, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalledWith(errorResponse);
    });

    it('should call the next function for the environment with invalid keys.', async () => {
      mockRequest.body = { test: 'label', category: 'programmingLanguages', priority: Priority.LOW };
      errorResponse = new HttpException(400, ExceptionType.INVALID_ENVIRONMENT);

      await validateEnvironment(UpdateEnvironment)(mockRequest as Request, mockResponse as Response, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalledWith(errorResponse);
    });
  });
});
