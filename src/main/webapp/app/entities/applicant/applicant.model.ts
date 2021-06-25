import { IApplication } from 'app/entities/application/application.model';

export interface IApplicant {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  summary?: string | null;
  cTC?: number | null;
  eCTC?: number | null;
  highestEducation?: string | null;
  applications?: IApplication[] | null;
}

export class Applicant implements IApplicant {
  constructor(
    public id?: number,
    public firstName?: string | null,
    public lastName?: string | null,
    public email?: string | null,
    public phone?: string | null,
    public summary?: string | null,
    public cTC?: number | null,
    public eCTC?: number | null,
    public highestEducation?: string | null,
    public applications?: IApplication[] | null
  ) {}
}

export function getApplicantIdentifier(applicant: IApplicant): number | undefined {
  return applicant.id;
}
