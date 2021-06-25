import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJobCategories, JobCategories } from '../job-categories.model';
import { JobCategoriesService } from '../service/job-categories.service';

@Injectable({ providedIn: 'root' })
export class JobCategoriesRoutingResolveService implements Resolve<IJobCategories> {
  constructor(protected service: JobCategoriesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IJobCategories> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((jobCategories: HttpResponse<JobCategories>) => {
          if (jobCategories.body) {
            return of(jobCategories.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new JobCategories());
  }
}
