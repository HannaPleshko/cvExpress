import { EnvironmentCategory } from '@/database/Interfaces';

export interface IEnvironment {
  id: string;
  label: string;
  category: EnvironmentCategory;
  priority: Priority;
}

export interface IUpdateEnvironment {
  id: string;
  label?: string;
  category?: EnvironmentCategory;
  priority?: Priority;
}

//export type Priority = 1 | 2 | 3 | 4;

export enum Priority {
  LOW = 4,
  MIDDLE = 3,
  UPPER_MIDDLE = 2,
  HIGH = 1,
}
