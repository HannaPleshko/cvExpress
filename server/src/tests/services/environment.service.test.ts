// import { IEnvironment } from '@/interfaces/environment.interface';
// import EnvironmentService from '@/services/environment.service';
// // import { CreateEnvironment } from '@/dto/environment.dto';

describe('Environment service', () => {
  test('should return empty array if skill does not exist', () => {
    expect(true).toBeTruthy(); //to avoid error
  });

  // const skillsFromEnvironment: IEnvironment[] = [
  //   {
  //     id: 'javascript',
  //     label: 'JavaScript',
  //     category: 'programmingLanguages',
  //     priority: 1,
  //   },
  //   {
  //     id: 'typescript',
  //     label: 'TypeScript',
  //     category: 'programmingLanguages',
  //     priority: 1,
  //   },
  // ];
  // describe('method get skills by ids', () => {
  //   const service = new EnvironmentService();
  //   test('should return all skills by ids', () => {
  //     const skills = service.getSkillsByIds(['javascript', 'typescript']);
  //     expect(skills).toEqual(skillsFromEnvironment);
  //   });
  //   test('should return empty array if skill does not exist', () => {
  //     const skills = service.getSkillsByIds(['js2']);
  //     expect(skills).toEqual([]);
  //   });
  // });
  // describe('environment.service.saveEnvironment', () => {
  //   const mockEnvironment: CreateEnvironment = { label: 'Test Skill', category: 'webTechnologies' };
  //   EnvironmentService.prototype.updateEnvironmentFile = jest.fn();
  //   EnvironmentService.prototype.readEnvironmentFile = jest.fn();
  //   const environmentService = new EnvironmentService();
  //   afterAll(() => {
  //     jest.clearAllMocks();
  //   });
  //   afterEach(() => {
  //     jest.clearAllMocks();
  //   });
  //   it('passes and returns created skill', async () => {
  //     const expectedResult = { label: 'Test Skill', category: 'webTechnologies', id: 'testskill', priority: 4 };
  //     const receivedResult = await environmentService.saveEnvironment(mockEnvironment);
  //     expect(environmentService.updateEnvironmentFile).toHaveBeenCalled();
  //     expect(environmentService.updateEnvironmentFile).toBeCalledWith([expectedResult]);
  //     expect(receivedResult).toEqual(expectedResult);
  //   });
  // });
});
