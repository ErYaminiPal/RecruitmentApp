import { IJobs } from 'app/entities/jobs/jobs.model';

export interface IClientOrganization {
  id?: number;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  jobs?: IJobs[] | null;
}

export class ClientOrganization implements IClientOrganization {
  constructor(
    public id?: number,
    public code?: string | null,
    public name?: string | null,
    public description?: string | null,
    public jobs?: IJobs[] | null
  ) {}
}

export function getClientOrganizationIdentifier(clientOrganization: IClientOrganization): number | undefined {
  return clientOrganization.id;
}
