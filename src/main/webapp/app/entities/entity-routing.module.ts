import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'step',
        data: { pageTitle: 'Steps' },
        loadChildren: () => import('./step/step.module').then(m => m.StepModule),
      },
      {
        path: 'process',
        data: { pageTitle: 'Processes' },
        loadChildren: () => import('./process/process.module').then(m => m.ProcessModule),
      },
      {
        path: 'applicant',
        data: { pageTitle: 'Applicants' },
        loadChildren: () => import('./applicant/applicant.module').then(m => m.ApplicantModule),
      },
      {
        path: 'application',
        data: { pageTitle: 'Applications' },
        loadChildren: () => import('./application/application.module').then(m => m.ApplicationModule),
      },
      {
        path: 'jobs',
        data: { pageTitle: 'Jobs' },
        loadChildren: () => import('./jobs/jobs.module').then(m => m.JobsModule),
      },
      {
        path: 'job-categories',
        data: { pageTitle: 'JobCategories' },
        loadChildren: () => import('./job-categories/job-categories.module').then(m => m.JobCategoriesModule),
      },
      {
        path: 'job-position',
        data: { pageTitle: 'JobPositions' },
        loadChildren: () => import('./job-position/job-position.module').then(m => m.JobPositionModule),
      },
      {
        path: 'client-organization',
        data: { pageTitle: 'ClientOrganizations' },
        loadChildren: () => import('./client-organization/client-organization.module').then(m => m.ClientOrganizationModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
