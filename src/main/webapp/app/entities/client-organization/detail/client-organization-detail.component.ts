import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IClientOrganization } from '../client-organization.model';

@Component({
  selector: 'jhi-client-organization-detail',
  templateUrl: './client-organization-detail.component.html',
})
export class ClientOrganizationDetailComponent implements OnInit {
  clientOrganization: IClientOrganization | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clientOrganization }) => {
      this.clientOrganization = clientOrganization;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
