import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ClientOrganizationComponent } from '../list/client-organization.component';
import { ClientOrganizationDetailComponent } from '../detail/client-organization-detail.component';
import { ClientOrganizationUpdateComponent } from '../update/client-organization-update.component';
import { ClientOrganizationRoutingResolveService } from './client-organization-routing-resolve.service';

const clientOrganizationRoute: Routes = [
  {
    path: '',
    component: ClientOrganizationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClientOrganizationDetailComponent,
    resolve: {
      clientOrganization: ClientOrganizationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClientOrganizationUpdateComponent,
    resolve: {
      clientOrganization: ClientOrganizationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClientOrganizationUpdateComponent,
    resolve: {
      clientOrganization: ClientOrganizationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(clientOrganizationRoute)],
  exports: [RouterModule],
})
export class ClientOrganizationRoutingModule {}
