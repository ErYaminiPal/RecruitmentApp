import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IJobCategories } from '../job-categories.model';
import { JobCategoriesService } from '../service/job-categories.service';
import { JobCategoriesDeleteDialogComponent } from '../delete/job-categories-delete-dialog.component';

@Component({
  selector: 'jhi-job-categories',
  templateUrl: './job-categories.component.html',
})
export class JobCategoriesComponent implements OnInit {
  jobCategories?: IJobCategories[];
  isLoading = false;

  constructor(protected jobCategoriesService: JobCategoriesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.jobCategoriesService.query().subscribe(
      (res: HttpResponse<IJobCategories[]>) => {
        this.isLoading = false;
        this.jobCategories = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IJobCategories): number {
    return item.id!;
  }

  delete(jobCategories: IJobCategories): void {
    const modalRef = this.modalService.open(JobCategoriesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.jobCategories = jobCategories;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
