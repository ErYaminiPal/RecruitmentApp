import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ClientOrganizationComponent } from './list/client-organization.component';
import { ClientOrganizationDetailComponent } from './detail/client-organization-detail.component';
import { ClientOrganizationUpdateComponent } from './update/client-organization-update.component';
import { ClientOrganizationDeleteDialogComponent } from './delete/client-organization-delete-dialog.component';
import { ClientOrganizationRoutingModule } from './route/client-organization-routing.module';

@NgModule({
  imports: [SharedModule, ClientOrganizationRoutingModule],
  declarations: [
    ClientOrganizationComponent,
    ClientOrganizationDetailComponent,
    ClientOrganizationUpdateComponent,
    ClientOrganizationDeleteDialogComponent,
  ],
  entryComponents: [ClientOrganizationDeleteDialogComponent],
})
export class ClientOrganizationModule {}
