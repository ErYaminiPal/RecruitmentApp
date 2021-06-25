import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { JobCategoriesComponent } from './list/job-categories.component';
import { JobCategoriesDetailComponent } from './detail/job-categories-detail.component';
import { JobCategoriesUpdateComponent } from './update/job-categories-update.component';
import { JobCategoriesDeleteDialogComponent } from './delete/job-categories-delete-dialog.component';
import { JobCategoriesRoutingModule } from './route/job-categories-routing.module';

@NgModule({
  imports: [SharedModule, JobCategoriesRoutingModule],
  declarations: [JobCategoriesComponent, JobCategoriesDetailComponent, JobCategoriesUpdateComponent, JobCategoriesDeleteDialogComponent],
  entryComponents: [JobCategoriesDeleteDialogComponent],
})
export class JobCategoriesModule {}
