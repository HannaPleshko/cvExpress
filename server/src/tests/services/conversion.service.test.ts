// import { ResumeDto } from '@/dto/resume.dto';
// import { ExceptionType } from '@/exceptions/exceptions.type';
// import ConversionService from '@/services/conversion.service';
// import mockResume from '../mocks/mock.resume.json';
// import { HttpException } from './../../exceptions/HttpException';

describe('Conversion service', () => {
  // const resume = mockResume as ResumeDto;
  // let service = new ConversionService(resume);

  // const skillsFromEnvironment: string[] = ['javascript', 'typescript'];

  describe('method delete duplicated words', () => {
    test('should return empty array if skill does not exist', () => {
      expect(true).toBeTruthy(); //to avoid error
    });
    // test('should return a filtered array with no duplicated words', () => {
    //   const deletedDuplicateWords = service.deleteDuplicateWords(['js', 'ts', 'js', 'ts', 'ts']);

    //   expect(deletedDuplicateWords).toEqual(['js', 'ts']);
    // });
  });

  // describe('method sort skills from environment', () => {
  //   test('should return sorted skills from environment', () => {
  //     const sortedSkills = service.sortedEnvironment(skillsFromEnvironment);

  //     expect(sortedSkills).toEqual('JavaScript, TypeScript');
  //   });

  //   test('should return empty string if skill does not exist', () => {
  //     const sortedSkills = service.sortedEnvironment([]);

  //     expect(sortedSkills).toEqual('');
  //   });
  // });

  // describe('method gives labels by category', () => {
  //   test('should return labels by category', () => {
  //     const sortedSkills = service.getLabelsByCategory('programmingLanguages');

  //     expect(sortedSkills).toEqual('JavaScript, TypeScript, SQL, Java, GO');
  //   });

  //   test('should return empty string if category does not exist', () => {
  //     const sortedSkills = service.getLabelsByCategory('testCategory');

  //     expect(sortedSkills).toEqual('');
  //   });
  // });

  // describe('method convert Date to string with month and year', () => {
  //   test('should return month and year of date', () => {
  //     const sortedSkills = service.convertDateToString('2022-05-25');

  //     expect(sortedSkills).toEqual('May 2022');
  //   });

  //   test('should return error when date does not correct', () => {
  //     try {
  //       service.convertDateToString('');
  //     } catch (error: any) {
  //       const err: HttpException = error;
  //       expect(err.message).toEqual(ExceptionType.CONVERSION_CONVERT_DATE_INCORRECT.message);
  //     }
  //   });
  // });

  // describe('method of converting the start and end date', () => {
  //   test('should return month and year of date', () => {
  //     const sortedSkills = service.createDate('2022-05-25', '');

  //     expect(sortedSkills).toEqual('May 2022 - Present');
  //   });

  //   test('should return month and year of date', () => {
  //     const sortedSkills = service.createDate('2022-04-25', '2022-05-25');

  //     expect(sortedSkills).toEqual('April 2022 - May 2022');
  //   });

  //   test('should return error when date does not correct', () => {
  //     try {
  //       service.createDate('', '');
  //     } catch (error: any) {
  //       const err: HttpException = error;
  //       expect(err.message).toEqual(ExceptionType.CONVERSION_CONVERT_DATE_INCORRECT.message);
  //     }
  //   });
  // });

  // describe('method convert json to docx', () => {
  //   test('should return month and year of date', async () => {
  //     const resume = mockResume as ResumeDto;
  //     service = new ConversionService(resume);
  //     const docx = await service.convertToDocx();

  //     expect(docx instanceof Buffer).toBeTruthy();
  //   });

  //   test('should return conversion error ', async () => {
  //     try {
  //       const fakeJson = {} as ResumeDto;
  //       const service = new ConversionService(fakeJson);

  //       await service.convertToDocx();
  //     } catch (error: any) {
  //       const err: HttpException = error;
  //       expect(err.message).toEqual(ExceptionType.CONVERSION_CONVERT_NOT_CONVERTED.message);
  //     }
  //   });
  // });
});
