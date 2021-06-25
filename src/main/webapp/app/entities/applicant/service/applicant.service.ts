import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IApplicant, getApplicantIdentifier } from '../applicant.model';

export type EntityResponseType = HttpResponse<IApplicant>;
export type EntityArrayResponseType = HttpResponse<IApplicant[]>;

@Injectable({ providedIn: 'root' })
export class ApplicantService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/applicants');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(applicant: IApplicant): Observable<EntityResponseType> {
    return this.http.post<IApplicant>(this.resourceUrl, applicant, { observe: 'response' });
  }

  update(applicant: IApplicant): Observable<EntityResponseType> {
    return this.http.put<IApplicant>(`${this.resourceUrl}/${getApplicantIdentifier(applicant) as number}`, applicant, {
      observe: 'response',
    });
  }

  partialUpdate(applicant: IApplicant): Observable<EntityResponseType> {
    return this.http.patch<IApplicant>(`${this.resourceUrl}/${getApplicantIdentifier(applicant) as number}`, applicant, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IApplicant>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IApplicant[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addApplicantToCollectionIfMissing(
    applicantCollection: IApplicant[],
    ...applicantsToCheck: (IApplicant | null | undefined)[]
  ): IApplicant[] {
    const applicants: IApplicant[] = applicantsToCheck.filter(isPresent);
    if (applicants.length > 0) {
      const applicantCollectionIdentifiers = applicantCollection.map(applicantItem => getApplicantIdentifier(applicantItem)!);
      const applicantsToAdd = applicants.filter(applicantItem => {
        const applicantIdentifier = getApplicantIdentifier(applicantItem);
        if (applicantIdentifier == null || applicantCollectionIdentifiers.includes(applicantIdentifier)) {
          return false;
        }
        applicantCollectionIdentifiers.push(applicantIdentifier);
        return true;
      });
      return [...applicantsToAdd, ...applicantCollection];
    }
    return applicantCollection;
  }
}
