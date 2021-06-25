import * as dayjs from 'dayjs';
import { IApplication } from 'app/entities/application/application.model';
import { IJobCategories } from 'app/entities/job-categories/job-categories.model';
import { IJobPosition } from 'app/entities/job-position/job-position.model';
import { IClientOrganization } from 'app/entities/client-organization/client-organization.model';
import { IProcess } from 'app/entities/process/process.model';

export interface IJobs {
  id?: number;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  datePublished?: dayjs.Dayjs | null;
  jobStartDate?: dayjs.Dayjs | null;
  noOfVacancies?: number | null;
  applications?: IApplication[] | null;
  jobCategories?: IJobCategories | null;
  jobPosition?: IJobPosition | null;
  clientOrganization?: IClientOrganization | null;
  process?: IProcess | null;
}

export class Jobs implements IJobs {
  constructor(
    public id?: number,
    public code?: string | null,
    public name?: string | null,
    public description?: string | null,
    public datePublished?: dayjs.Dayjs | null,
    public jobStartDate?: dayjs.Dayjs | null,
    public noOfVacancies?: number | null,
    public applications?: IApplication[] | null,
    public jobCategories?: IJobCategories | null,
    public jobPosition?: IJobPosition | null,
    public clientOrganization?: IClientOrganization | null,
    public process?: IProcess | null
  ) {}
}

export function getJobsIdentifier(jobs: IJobs): number | undefined {
  return jobs.id;
}
