import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IJobs } from '../jobs.model';
import { JobsService } from '../service/jobs.service';
import { JobsDeleteDialogComponent } from '../delete/jobs-delete-dialog.component';

@Component({
  selector: 'jhi-jobs',
  templateUrl: './jobs.component.html',
})
export class JobsComponent implements OnInit {
  jobs?: IJobs[];
  isLoading = false;

  constructor(protected jobsService: JobsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.jobsService.query().subscribe(
      (res: HttpResponse<IJobs[]>) => {
        this.isLoading = false;
        this.jobs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IJobs): number {
    return item.id!;
  }

  delete(jobs: IJobs): void {
    const modalRef = this.modalService.open(JobsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.jobs = jobs;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
