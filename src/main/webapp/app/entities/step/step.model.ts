import { IProcess } from 'app/entities/process/process.model';

export interface IStep {
  id?: number;
  code?: string | null;
  name?: string | null;
  process?: IProcess | null;
}

export class Step implements IStep {
  constructor(public id?: number, public code?: string | null, public name?: string | null, public process?: IProcess | null) {}
}

export function getStepIdentifier(step: IStep): number | undefined {
  return step.id;
}
