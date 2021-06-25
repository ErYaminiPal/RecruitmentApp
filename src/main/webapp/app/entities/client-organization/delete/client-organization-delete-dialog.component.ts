import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IClientOrganization } from '../client-organization.model';
import { ClientOrganizationService } from '../service/client-organization.service';

@Component({
  templateUrl: './client-organization-delete-dialog.component.html',
})
export class ClientOrganizationDeleteDialogComponent {
  clientOrganization?: IClientOrganization;

  constructor(protected clientOrganizationService: ClientOrganizationService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.clientOrganizationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
