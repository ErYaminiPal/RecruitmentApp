import * as dayjs from 'dayjs';
import { IApplicant } from 'app/entities/applicant/applicant.model';
import { IJobs } from 'app/entities/jobs/jobs.model';

export interface IApplication {
  id?: number;
  dateOfApplication?: dayjs.Dayjs | null;
  education?: string | null;
  experience?: string | null;
  otherInfo?: string | null;
  name?: string | null;
  applicant?: IApplicant | null;
  jobs?: IJobs | null;
}

export class Application implements IApplication {
  constructor(
    public id?: number,
    public dateOfApplication?: dayjs.Dayjs | null,
    public education?: string | null,
    public experience?: string | null,
    public otherInfo?: string | null,
    public name?: string | null,
    public applicant?: IApplicant | null,
    public jobs?: IJobs | null
  ) {}
}

export function getApplicationIdentifier(application: IApplication): number | undefined {
  return application.id;
}
