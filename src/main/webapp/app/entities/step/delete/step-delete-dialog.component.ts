import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStep } from '../step.model';
import { StepService } from '../service/step.service';

@Component({
  templateUrl: './step-delete-dialog.component.html',
})
export class StepDeleteDialogComponent {
  step?: IStep;

  constructor(protected stepService: StepService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.stepService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
