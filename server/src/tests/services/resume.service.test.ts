import { ExceptionType } from '@/exceptions/exceptions.type';
import fs from 'fs/promises';
// import { ResumeDto } from '../../dto/resume.dto';
import ResumeService from '@/services/resume.service';
// import resume from '../mocks/mock.resume.json';
import { HttpException } from './../../exceptions/HttpException';

// const TestResume = resume as ResumeDto;
const arrayOfFiles = ['test.doc', 'test2.doc'];

jest.mock('fs/promises', () => {
  return {
    readdir: jest.fn().mockImplementation(() => arrayOfFiles),
    writeFile: jest.fn().mockImplementation(() => {
      arrayOfFiles.push('TestFile.doc');

      return Promise.resolve(true);
    }),
    readFile: jest.fn().mockImplementation(() => undefined),
  };
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  jest.clearAllMocks();
});

describe('Testing Service', () => {
  const resumeService = new ResumeService();

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe('Resume Service', () => {
    // it('should save doc file and return file name', async () => {
    //   await resumeService.save(TestResume);

    //   expect('TestFile.doc').toEqual(arrayOfFiles[arrayOfFiles.length - 1]);
    //   expect(fs.readFile).toBeCalled();
    //   expect(fs.writeFile).toBeCalled();
    // });

    // it('should save doc file and return file name', async () => {
    //   await resumeService.save(TestResume);

    //   expect('TestFile.doc').toEqual(arrayOfFiles[arrayOfFiles.length - 1]);
    //   expect(fs.readFile).toBeCalled();
    //   expect(fs.writeFile).toBeCalled();
    // });

    // it('should save doc file and return file name', async () => {
    //   const ResumeWithoutLng = { ...TestResume };
    //   ResumeWithoutLng.skills.languages = null;

    //   await resumeService.save(ResumeWithoutLng);

    //   expect('TestFile.doc').toEqual(arrayOfFiles[arrayOfFiles.length - 1]);
    //   expect(fs.readFile).toBeCalled();
    //   expect(fs.writeFile).toBeCalled();
    // });

    // it('should save doc file and return file name', async () => {
    //   try {
    //     const ResumeInvalidDate = { ...TestResume };
    //     ResumeInvalidDate.experience[0].startDate = 'invalid date';

    //     await resumeService.save(ResumeInvalidDate);
    //   } catch (error: any) {
    //     const err: HttpException = error;
    //     expect(err.message).toEqual(ExceptionType.CONVERSION_CONVERT_DATE_INCORRECT.message);
    //     expect(err.status).toEqual(400);
    //     expect(err.id).toEqual(ExceptionType.CONVERSION_CONVERT_DATE_INCORRECT.id);
    //   }
    // });

    // it('should save doc file with empty fileName property and return file name', async () => {
    //   const invalidData: ResumeDto = {
    //     header: {
    //       firstName: undefined,
    //       lastName: undefined,
    //       user_position: undefined,
    //       position_level: undefined,
    //       profile: undefined,
    //     },
    //     skills: {
    //       operatingSystems: [undefined],
    //       languages: undefined,
    //     },
    //     experience: [
    //       {
    //         user_position: undefined,
    //         position_level: undefined,
    //         companyName: undefined,
    //         startDate: undefined,
    //         endDate: null,
    //         projects: [
    //           {
    //             user_position: undefined,
    //             position_level: undefined,
    //             description: undefined,
    //             responsibilities: undefined,
    //             environment: undefined,
    //           },
    //         ],
    //       },
    //     ],
    //     education: undefined,
    //     fileName: undefined,
    //   };

    //   await expect(resumeService.save(invalidData)).rejects.toThrowError(ExceptionType.CONVERSION_CONVERT_NOT_CONVERTED.message);
    // });

    // it('should create file name', () => {
    //   const testFileName = 'TestTesting';
    //   const extension = 'doc';

    //   const fileName = resumeService.createFileName(testFileName);
    //   const newFileName = fileName.split('.')[0];
    //   const fileExtension = fileName.split('.')[1];

    //   expect(testFileName).toEqual(newFileName);
    //   expect(extension).toEqual(fileExtension);
    // });

    // it('should create file name without spaces', () => {
    //   const testFileNameWithSpace = 'Test Testing';
    //   const extension = 'doc';

    //   const fileName = resumeService.createFileName(testFileNameWithSpace);
    //   const newFileName = fileName.split('.')[0];
    //   const fileExtension = fileName.split('.')[1];

    //   expect(testFileNameWithSpace).not.toEqual(newFileName);
    //   expect(extension).toEqual(fileExtension);
    // });

    // it('should return all resumes in directory', async () => {
    //   const resumes = await resumeService.getResumes();

    //   expect(resumes).toEqual(arrayOfFiles);
    //   expect(fs.readdir).toBeCalled();
    // });

    it('should return path to file', async () => {
      const fileName = 'test.doc';

      const pathToFile = await resumeService.download(fileName);

      expect(pathToFile).toBeDefined();
      expect(fs.readdir).toBeCalled();
    });

    it('should return an error when file does not exist', async () => {
      try {
        const fileName = 'nonexistentFile.doc';

        await resumeService.download(fileName);
      } catch (err: any) {
        const error: HttpException = err;
        expect(error.message).toEqual(ExceptionType.RESUME_DOWNLOAD_NOT_FOUND.message);
        expect(fs.readdir).toBeCalled();
      }
    });
  });
});
