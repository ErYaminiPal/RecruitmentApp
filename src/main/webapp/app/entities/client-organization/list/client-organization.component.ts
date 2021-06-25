import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IClientOrganization } from '../client-organization.model';
import { ClientOrganizationService } from '../service/client-organization.service';
import { ClientOrganizationDeleteDialogComponent } from '../delete/client-organization-delete-dialog.component';

@Component({
  selector: 'jhi-client-organization',
  templateUrl: './client-organization.component.html',
})
export class ClientOrganizationComponent implements OnInit {
  clientOrganizations?: IClientOrganization[];
  isLoading = false;

  constructor(protected clientOrganizationService: ClientOrganizationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.clientOrganizationService.query().subscribe(
      (res: HttpResponse<IClientOrganization[]>) => {
        this.isLoading = false;
        this.clientOrganizations = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IClientOrganization): number {
    return item.id!;
  }

  delete(clientOrganization: IClientOrganization): void {
    const modalRef = this.modalService.open(ClientOrganizationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.clientOrganization = clientOrganization;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
