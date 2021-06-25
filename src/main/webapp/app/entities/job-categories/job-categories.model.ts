import { IJobs } from 'app/entities/jobs/jobs.model';

export interface IJobCategories {
  id?: number;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  jobs?: IJobs[] | null;
}

export class JobCategories implements IJobCategories {
  constructor(
    public id?: number,
    public code?: string | null,
    public name?: string | null,
    public description?: string | null,
    public jobs?: IJobs[] | null
  ) {}
}

export function getJobCategoriesIdentifier(jobCategories: IJobCategories): number | undefined {
  return jobCategories.id;
}
