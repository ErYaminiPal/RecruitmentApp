import { IStep } from 'app/entities/step/step.model';
import { IJobs } from 'app/entities/jobs/jobs.model';

export interface IProcess {
  id?: number;
  code?: string | null;
  description?: string | null;
  steps?: IStep[] | null;
  jobs?: IJobs[] | null;
}

export class Process implements IProcess {
  constructor(
    public id?: number,
    public code?: string | null,
    public description?: string | null,
    public steps?: IStep[] | null,
    public jobs?: IJobs[] | null
  ) {}
}

export function getProcessIdentifier(process: IProcess): number | undefined {
  return process.id;
}
