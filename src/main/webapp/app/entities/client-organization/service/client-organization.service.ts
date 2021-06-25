import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClientOrganization, getClientOrganizationIdentifier } from '../client-organization.model';

export type EntityResponseType = HttpResponse<IClientOrganization>;
export type EntityArrayResponseType = HttpResponse<IClientOrganization[]>;

@Injectable({ providedIn: 'root' })
export class ClientOrganizationService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/client-organizations');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(clientOrganization: IClientOrganization): Observable<EntityResponseType> {
    return this.http.post<IClientOrganization>(this.resourceUrl, clientOrganization, { observe: 'response' });
  }

  update(clientOrganization: IClientOrganization): Observable<EntityResponseType> {
    return this.http.put<IClientOrganization>(
      `${this.resourceUrl}/${getClientOrganizationIdentifier(clientOrganization) as number}`,
      clientOrganization,
      { observe: 'response' }
    );
  }

  partialUpdate(clientOrganization: IClientOrganization): Observable<EntityResponseType> {
    return this.http.patch<IClientOrganization>(
      `${this.resourceUrl}/${getClientOrganizationIdentifier(clientOrganization) as number}`,
      clientOrganization,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClientOrganization>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClientOrganization[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addClientOrganizationToCollectionIfMissing(
    clientOrganizationCollection: IClientOrganization[],
    ...clientOrganizationsToCheck: (IClientOrganization | null | undefined)[]
  ): IClientOrganization[] {
    const clientOrganizations: IClientOrganization[] = clientOrganizationsToCheck.filter(isPresent);
    if (clientOrganizations.length > 0) {
      const clientOrganizationCollectionIdentifiers = clientOrganizationCollection.map(
        clientOrganizationItem => getClientOrganizationIdentifier(clientOrganizationItem)!
      );
      const clientOrganizationsToAdd = clientOrganizations.filter(clientOrganizationItem => {
        const clientOrganizationIdentifier = getClientOrganizationIdentifier(clientOrganizationItem);
        if (clientOrganizationIdentifier == null || clientOrganizationCollectionIdentifiers.includes(clientOrganizationIdentifier)) {
          return false;
        }
        clientOrganizationCollectionIdentifiers.push(clientOrganizationIdentifier);
        return true;
      });
      return [...clientOrganizationsToAdd, ...clientOrganizationCollection];
    }
    return clientOrganizationCollection;
  }
}
