import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJobPosition, getJobPositionIdentifier } from '../job-position.model';

export type EntityResponseType = HttpResponse<IJobPosition>;
export type EntityArrayResponseType = HttpResponse<IJobPosition[]>;

@Injectable({ providedIn: 'root' })
export class JobPositionService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/job-positions');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(jobPosition: IJobPosition): Observable<EntityResponseType> {
    return this.http.post<IJobPosition>(this.resourceUrl, jobPosition, { observe: 'response' });
  }

  update(jobPosition: IJobPosition): Observable<EntityResponseType> {
    return this.http.put<IJobPosition>(`${this.resourceUrl}/${getJobPositionIdentifier(jobPosition) as number}`, jobPosition, {
      observe: 'response',
    });
  }

  partialUpdate(jobPosition: IJobPosition): Observable<EntityResponseType> {
    return this.http.patch<IJobPosition>(`${this.resourceUrl}/${getJobPositionIdentifier(jobPosition) as number}`, jobPosition, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJobPosition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJobPosition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addJobPositionToCollectionIfMissing(
    jobPositionCollection: IJobPosition[],
    ...jobPositionsToCheck: (IJobPosition | null | undefined)[]
  ): IJobPosition[] {
    const jobPositions: IJobPosition[] = jobPositionsToCheck.filter(isPresent);
    if (jobPositions.length > 0) {
      const jobPositionCollectionIdentifiers = jobPositionCollection.map(jobPositionItem => getJobPositionIdentifier(jobPositionItem)!);
      const jobPositionsToAdd = jobPositions.filter(jobPositionItem => {
        const jobPositionIdentifier = getJobPositionIdentifier(jobPositionItem);
        if (jobPositionIdentifier == null || jobPositionCollectionIdentifiers.includes(jobPositionIdentifier)) {
          return false;
        }
        jobPositionCollectionIdentifiers.push(jobPositionIdentifier);
        return true;
      });
      return [...jobPositionsToAdd, ...jobPositionCollection];
    }
    return jobPositionCollection;
  }
}
