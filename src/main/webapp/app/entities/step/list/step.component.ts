import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IStep } from '../step.model';
import { StepService } from '../service/step.service';
import { StepDeleteDialogComponent } from '../delete/step-delete-dialog.component';

@Component({
  selector: 'jhi-step',
  templateUrl: './step.component.html',
})
export class StepComponent implements OnInit {
  steps?: IStep[];
  isLoading = false;

  constructor(protected stepService: StepService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.stepService.query().subscribe(
      (res: HttpResponse<IStep[]>) => {
        this.isLoading = false;
        this.steps = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IStep): number {
    return item.id!;
  }

  delete(step: IStep): void {
    const modalRef = this.modalService.open(StepDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.step = step;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
