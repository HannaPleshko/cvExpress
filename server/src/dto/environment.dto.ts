import { EnvironmentCategory } from '@/database/Interfaces';
import { IEnvironment, Priority } from '@/interfaces/environment.interface';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

class Environment {
  constructor(data: IEnvironment) {
    this.label = data.label;
    this.category = data.category;
    this.priority = data.priority;
  }

  @IsNotEmpty()
  @IsString()
  label: string;

  @IsNotEmpty()
  @IsString()
  category: EnvironmentCategory;

  @IsOptional()
  @IsNumber()
  priority?: Priority;
}
export class CreateEnvironment extends Environment {}
export class UpdateEnvironment extends Environment {
  @IsOptional()
  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  category: EnvironmentCategory;

  @IsOptional()
  @IsNumber()
  priority?: Priority;
}
