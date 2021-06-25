import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJobCategories, getJobCategoriesIdentifier } from '../job-categories.model';

export type EntityResponseType = HttpResponse<IJobCategories>;
export type EntityArrayResponseType = HttpResponse<IJobCategories[]>;

@Injectable({ providedIn: 'root' })
export class JobCategoriesService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/job-categories');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(jobCategories: IJobCategories): Observable<EntityResponseType> {
    return this.http.post<IJobCategories>(this.resourceUrl, jobCategories, { observe: 'response' });
  }

  update(jobCategories: IJobCategories): Observable<EntityResponseType> {
    return this.http.put<IJobCategories>(`${this.resourceUrl}/${getJobCategoriesIdentifier(jobCategories) as number}`, jobCategories, {
      observe: 'response',
    });
  }

  partialUpdate(jobCategories: IJobCategories): Observable<EntityResponseType> {
    return this.http.patch<IJobCategories>(`${this.resourceUrl}/${getJobCategoriesIdentifier(jobCategories) as number}`, jobCategories, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJobCategories>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJobCategories[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addJobCategoriesToCollectionIfMissing(
    jobCategoriesCollection: IJobCategories[],
    ...jobCategoriesToCheck: (IJobCategories | null | undefined)[]
  ): IJobCategories[] {
    const jobCategories: IJobCategories[] = jobCategoriesToCheck.filter(isPresent);
    if (jobCategories.length > 0) {
      const jobCategoriesCollectionIdentifiers = jobCategoriesCollection.map(
        jobCategoriesItem => getJobCategoriesIdentifier(jobCategoriesItem)!
      );
      const jobCategoriesToAdd = jobCategories.filter(jobCategoriesItem => {
        const jobCategoriesIdentifier = getJobCategoriesIdentifier(jobCategoriesItem);
        if (jobCategoriesIdentifier == null || jobCategoriesCollectionIdentifiers.includes(jobCategoriesIdentifier)) {
          return false;
        }
        jobCategoriesCollectionIdentifiers.push(jobCategoriesIdentifier);
        return true;
      });
      return [...jobCategoriesToAdd, ...jobCategoriesCollection];
    }
    return jobCategoriesCollection;
  }
}
