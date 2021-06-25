import { IJobs } from 'app/entities/jobs/jobs.model';

export interface IJobPosition {
  id?: number;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  jobs?: IJobs[] | null;
}

export class JobPosition implements IJobPosition {
  constructor(
    public id?: number,
    public code?: string | null,
    public name?: string | null,
    public description?: string | null,
    public jobs?: IJobs[] | null
  ) {}
}

export function getJobPositionIdentifier(jobPosition: IJobPosition): number | undefined {
  return jobPosition.id;
}
