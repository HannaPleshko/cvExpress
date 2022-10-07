import { EnvironmentCategory, PositionLevelType, PositionType } from '@/database/Interfaces';
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class ResumeDto {
  id?: string;
  @ValidateNested()
  header: ResumeHeader;

  @ValidateNested()
  skills: ResumeSkills;

  @ValidateNested()
  experience: ResumeExperience[];

  @IsArray()
  @IsNotEmpty()
  education: string[];

  @IsNotEmpty()
  @IsString()
  filename: string;
}

export class ResumeHeader {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  userPosition: PositionType;

  @IsNotEmpty()
  positionLevel: PositionLevelType;

  @IsNotEmpty()
  @IsArray()
  profile: string[];
}

export class ResumeSkills {
  @IsNotEmpty()
  @IsArray()
  operatingSystems: string[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  languages: Languages[];
}

export class Languages {
  @IsNotEmpty()
  @IsString()
  language: string;

  @IsNotEmpty()
  @IsString()
  level: string;
}

export class ResumeExperience {
  @IsNotEmpty()
  userPosition: PositionType;

  @IsNotEmpty()
  positionLevel: PositionLevelType;

  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date | string;

  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  endDate: Date | string | null;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  projects: Projects[];
}

export class Projects {
  @IsNotEmpty()
  userPosition: PositionType;

  @IsNotEmpty()
  positionLevel: PositionLevelType;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  responsibilities: string[];

  @IsNotEmpty()
  @ValidateNested()
  @IsArray()
  environment: Environments[];
}

export class Environments {
  @IsNotEmpty()
  @IsString()
  environment_id: string;

  @IsNotEmpty()
  @IsString()
  label: string;

  @IsNotEmpty()
  @ValidateNested()
  category: EnvironmentCategory;

  @IsNotEmpty()
  @IsNumber()
  priority: number;
}
