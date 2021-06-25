import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { JobCategoriesComponent } from '../list/job-categories.component';
import { JobCategoriesDetailComponent } from '../detail/job-categories-detail.component';
import { JobCategoriesUpdateComponent } from '../update/job-categories-update.component';
import { JobCategoriesRoutingResolveService } from './job-categories-routing-resolve.service';

const jobCategoriesRoute: Routes = [
  {
    path: '',
    component: JobCategoriesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: JobCategoriesDetailComponent,
    resolve: {
      jobCategories: JobCategoriesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: JobCategoriesUpdateComponent,
    resolve: {
      jobCategories: JobCategoriesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: JobCategoriesUpdateComponent,
    resolve: {
      jobCategories: JobCategoriesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(jobCategoriesRoute)],
  exports: [RouterModule],
})
export class JobCategoriesRoutingModule {}
