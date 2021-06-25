import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProcess } from '../process.model';
import { ProcessService } from '../service/process.service';
import { ProcessDeleteDialogComponent } from '../delete/process-delete-dialog.component';

@Component({
  selector: 'jhi-process',
  templateUrl: './process.component.html',
})
export class ProcessComponent implements OnInit {
  processes?: IProcess[];
  isLoading = false;

  constructor(protected processService: ProcessService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.processService.query().subscribe(
      (res: HttpResponse<IProcess[]>) => {
        this.isLoading = false;
        this.processes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProcess): number {
    return item.id!;
  }

  delete(process: IProcess): void {
    const modalRef = this.modalService.open(ProcessDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.process = process;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
