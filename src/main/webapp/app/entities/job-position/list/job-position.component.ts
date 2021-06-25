import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IJobPosition } from '../job-position.model';
import { JobPositionService } from '../service/job-position.service';
import { JobPositionDeleteDialogComponent } from '../delete/job-position-delete-dialog.component';

@Component({
  selector: 'jhi-job-position',
  templateUrl: './job-position.component.html',
})
export class JobPositionComponent implements OnInit {
  jobPositions?: IJobPosition[];
  isLoading = false;

  constructor(protected jobPositionService: JobPositionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.jobPositionService.query().subscribe(
      (res: HttpResponse<IJobPosition[]>) => {
        this.isLoading = false;
        this.jobPositions = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IJobPosition): number {
    return item.id!;
  }

  delete(jobPosition: IJobPosition): void {
    const modalRef = this.modalService.open(JobPositionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.jobPosition = jobPosition;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
