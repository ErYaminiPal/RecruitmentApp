import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { JobPositionComponent } from '../list/job-position.component';
import { JobPositionDetailComponent } from '../detail/job-position-detail.component';
import { JobPositionUpdateComponent } from '../update/job-position-update.component';
import { JobPositionRoutingResolveService } from './job-position-routing-resolve.service';

const jobPositionRoute: Routes = [
  {
    path: '',
    component: JobPositionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: JobPositionDetailComponent,
    resolve: {
      jobPosition: JobPositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: JobPositionUpdateComponent,
    resolve: {
      jobPosition: JobPositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: JobPositionUpdateComponent,
    resolve: {
      jobPosition: JobPositionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(jobPositionRoute)],
  exports: [RouterModule],
})
export class JobPositionRoutingModule {}
