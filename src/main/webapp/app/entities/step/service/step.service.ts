import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStep, getStepIdentifier } from '../step.model';

export type EntityResponseType = HttpResponse<IStep>;
export type EntityArrayResponseType = HttpResponse<IStep[]>;

@Injectable({ providedIn: 'root' })
export class StepService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/steps');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(step: IStep): Observable<EntityResponseType> {
    return this.http.post<IStep>(this.resourceUrl, step, { observe: 'response' });
  }

  update(step: IStep): Observable<EntityResponseType> {
    return this.http.put<IStep>(`${this.resourceUrl}/${getStepIdentifier(step) as number}`, step, { observe: 'response' });
  }

  partialUpdate(step: IStep): Observable<EntityResponseType> {
    return this.http.patch<IStep>(`${this.resourceUrl}/${getStepIdentifier(step) as number}`, step, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStep>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStep[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addStepToCollectionIfMissing(stepCollection: IStep[], ...stepsToCheck: (IStep | null | undefined)[]): IStep[] {
    const steps: IStep[] = stepsToCheck.filter(isPresent);
    if (steps.length > 0) {
      const stepCollectionIdentifiers = stepCollection.map(stepItem => getStepIdentifier(stepItem)!);
      const stepsToAdd = steps.filter(stepItem => {
        const stepIdentifier = getStepIdentifier(stepItem);
        if (stepIdentifier == null || stepCollectionIdentifiers.includes(stepIdentifier)) {
          return false;
        }
        stepCollectionIdentifiers.push(stepIdentifier);
        return true;
      });
      return [...stepsToAdd, ...stepCollection];
    }
    return stepCollection;
  }
}
