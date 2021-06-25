import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IClientOrganization, ClientOrganization } from '../client-organization.model';
import { ClientOrganizationService } from '../service/client-organization.service';

@Component({
  selector: 'jhi-client-organization-update',
  templateUrl: './client-organization-update.component.html',
})
export class ClientOrganizationUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    code: [],
    name: [],
    description: [],
  });

  constructor(
    protected clientOrganizationService: ClientOrganizationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clientOrganization }) => {
      this.updateForm(clientOrganization);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const clientOrganization = this.createFromForm();
    if (clientOrganization.id !== undefined) {
      this.subscribeToSaveResponse(this.clientOrganizationService.update(clientOrganization));
    } else {
      this.subscribeToSaveResponse(this.clientOrganizationService.create(clientOrganization));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClientOrganization>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(clientOrganization: IClientOrganization): void {
    this.editForm.patchValue({
      id: clientOrganization.id,
      code: clientOrganization.code,
      name: clientOrganization.name,
      description: clientOrganization.description,
    });
  }

  protected createFromForm(): IClientOrganization {
    return {
      ...new ClientOrganization(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
