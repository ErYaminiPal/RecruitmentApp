import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IJobPosition } from '../job-position.model';
import { JobPositionService } from '../service/job-position.service';

@Component({
  templateUrl: './job-position-delete-dialog.component.html',
})
export class JobPositionDeleteDialogComponent {
  jobPosition?: IJobPosition;

  constructor(protected jobPositionService: JobPositionService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jobPositionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
