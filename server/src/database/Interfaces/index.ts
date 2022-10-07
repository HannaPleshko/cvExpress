export type BaseLevelType = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type BaseLanguageType = 'English' | 'Polish' | 'German' | 'Russian' | 'French' | 'Chinese';

export interface IUserLanguages {
  user_language_id?: string;
  base_language?: BaseLanguageType;
  base_level?: BaseLevelType;
}

export interface ISkillUserLanguages {
  user_language_id?: string;
  skill_id?: string;
}

export interface IOperatingSystem {
  operatingSystem_id?: string;
  operatingSystem?: string;
}

export type OperatingSystemType = 'Windows' | 'Mac OS' | 'Linux' | 'iOS' | 'Android';

export interface ISkills {
  skill_id?: string;
  operating_systems?: string;
}

export interface ISkillsForCreate {
  skill_id?: string;
  operating_systems?: string[];
}

export interface IResponsibility {
  responsibility_id?: string;
  responsibility?: string;
}

export type EnvironmentCategory = 'programmingLanguages' | 'applicationServers' | 'databases' | 'webTechnologies' | 'otherSkills';

export enum Priority {
  LOW = 4,
  MIDDLE = 3,
  UPPER_MIDDLE = 2,
  HIGH = 1,
}

export interface IEnvironment {
  environment_id?: string;
  label?: string;
  category?: EnvironmentCategory;
  priority?: Priority;
}

export type PositionType =
  | 'Software Engineer'
  | 'CEO'
  | 'Team Lead'
  | 'Enterprise Architect'
  | 'Project Manager'
  | 'Delivery Manager'
  | 'Software Engineer'
  | 'Business Analyst'
  | 'QA Engineer'
  | 'DevOps Engineer'
  | 'DB Administrator'
  | 'UI/UX Specialist';

export type PositionLevelType = 'Trainee' | 'Junior' | 'Middle' | 'Senior' | 'Team Lead';

export interface IEducation {
  resume_id?: string;
  education_id?: string;
  education?: string;
}

export interface IProject {
  project_id?: string;
  user_position?: PositionType;
  position_level?: PositionLevelType | null;
  description?: string;
}
export interface ICompany {
  company_id?: string;
  company?: string;
}

export interface IHeader {
  header_id?: string;
  user_position?: PositionType;
  position_level?: PositionLevelType | null;
  profiles?: string[];
}

export interface IProjectExperience {
  project_id?: string;
  experience_id?: string;
}

export interface IExperience {
  experience_id?: string;
  start_date?: Date | string;
  end_date?: Date | string | null;
  company_id?: string;
  user_position?: PositionType;
  position_level?: PositionLevelType | null;
}

export interface IResume {
  resume_id?: string;
  skill_id?: string;
  filename?: string;
  user_id?: string;
}

export interface IExperienceResume {
  experience_id?: string;
  resume_id?: string;
}

export interface IEnvironmentProject {
  project_id?: string;
  environment_id?: string;
}

export interface IResponsibilityProject {
  project_id?: string;
  responsibility_id?: string;
}

export interface IUser {
  user_id?: string;
  firstname?: string;
  lastname?: string;
  header_id?: string | null;
}
