import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJobs, getJobsIdentifier } from '../jobs.model';

export type EntityResponseType = HttpResponse<IJobs>;
export type EntityArrayResponseType = HttpResponse<IJobs[]>;

@Injectable({ providedIn: 'root' })
export class JobsService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/jobs');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(jobs: IJobs): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobs);
    return this.http
      .post<IJobs>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(jobs: IJobs): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobs);
    return this.http
      .put<IJobs>(`${this.resourceUrl}/${getJobsIdentifier(jobs) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(jobs: IJobs): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobs);
    return this.http
      .patch<IJobs>(`${this.resourceUrl}/${getJobsIdentifier(jobs) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IJobs>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IJobs[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addJobsToCollectionIfMissing(jobsCollection: IJobs[], ...jobsToCheck: (IJobs | null | undefined)[]): IJobs[] {
    const jobs: IJobs[] = jobsToCheck.filter(isPresent);
    if (jobs.length > 0) {
      const jobsCollectionIdentifiers = jobsCollection.map(jobsItem => getJobsIdentifier(jobsItem)!);
      const jobsToAdd = jobs.filter(jobsItem => {
        const jobsIdentifier = getJobsIdentifier(jobsItem);
        if (jobsIdentifier == null || jobsCollectionIdentifiers.includes(jobsIdentifier)) {
          return false;
        }
        jobsCollectionIdentifiers.push(jobsIdentifier);
        return true;
      });
      return [...jobsToAdd, ...jobsCollection];
    }
    return jobsCollection;
  }

  protected convertDateFromClient(jobs: IJobs): IJobs {
    return Object.assign({}, jobs, {
      datePublished: jobs.datePublished?.isValid() ? jobs.datePublished.format(DATE_FORMAT) : undefined,
      jobStartDate: jobs.jobStartDate?.isValid() ? jobs.jobStartDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.datePublished = res.body.datePublished ? dayjs(res.body.datePublished) : undefined;
      res.body.jobStartDate = res.body.jobStartDate ? dayjs(res.body.jobStartDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((jobs: IJobs) => {
        jobs.datePublished = jobs.datePublished ? dayjs(jobs.datePublished) : undefined;
        jobs.jobStartDate = jobs.jobStartDate ? dayjs(jobs.jobStartDate) : undefined;
      });
    }
    return res;
  }
}
