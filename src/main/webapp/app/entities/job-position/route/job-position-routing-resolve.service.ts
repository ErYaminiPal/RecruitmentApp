import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJobPosition, JobPosition } from '../job-position.model';
import { JobPositionService } from '../service/job-position.service';

@Injectable({ providedIn: 'root' })
export class JobPositionRoutingResolveService implements Resolve<IJobPosition> {
  constructor(protected service: JobPositionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IJobPosition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((jobPosition: HttpResponse<JobPosition>) => {
          if (jobPosition.body) {
            return of(jobPosition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new JobPosition());
  }
}
