import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { JobPositionComponent } from './list/job-position.component';
import { JobPositionDetailComponent } from './detail/job-position-detail.component';
import { JobPositionUpdateComponent } from './update/job-position-update.component';
import { JobPositionDeleteDialogComponent } from './delete/job-position-delete-dialog.component';
import { JobPositionRoutingModule } from './route/job-position-routing.module';

@NgModule({
  imports: [SharedModule, JobPositionRoutingModule],
  declarations: [JobPositionComponent, JobPositionDetailComponent, JobPositionUpdateComponent, JobPositionDeleteDialogComponent],
  entryComponents: [JobPositionDeleteDialogComponent],
})
export class JobPositionModule {}
