import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStep, Step } from '../step.model';
import { StepService } from '../service/step.service';

@Injectable({ providedIn: 'root' })
export class StepRoutingResolveService implements Resolve<IStep> {
  constructor(protected service: StepService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStep> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((step: HttpResponse<Step>) => {
          if (step.body) {
            return of(step.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Step());
  }
}
