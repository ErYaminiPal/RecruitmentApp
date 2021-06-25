import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClientOrganization, ClientOrganization } from '../client-organization.model';
import { ClientOrganizationService } from '../service/client-organization.service';

@Injectable({ providedIn: 'root' })
export class ClientOrganizationRoutingResolveService implements Resolve<IClientOrganization> {
  constructor(protected service: ClientOrganizationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IClientOrganization> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((clientOrganization: HttpResponse<ClientOrganization>) => {
          if (clientOrganization.body) {
            return of(clientOrganization.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ClientOrganization());
  }
}
