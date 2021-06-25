import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IJobCategories } from '../job-categories.model';
import { JobCategoriesService } from '../service/job-categories.service';

@Component({
  templateUrl: './job-categories-delete-dialog.component.html',
})
export class JobCategoriesDeleteDialogComponent {
  jobCategories?: IJobCategories;

  constructor(protected jobCategoriesService: JobCategoriesService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jobCategoriesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
