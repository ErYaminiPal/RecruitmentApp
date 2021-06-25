import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IJobPosition, JobPosition } from '../job-position.model';
import { JobPositionService } from '../service/job-position.service';

@Component({
  selector: 'jhi-job-position-update',
  templateUrl: './job-position-update.component.html',
})
export class JobPositionUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    code: [],
    name: [],
    description: [],
  });

  constructor(protected jobPositionService: JobPositionService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobPosition }) => {
      this.updateForm(jobPosition);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jobPosition = this.createFromForm();
    if (jobPosition.id !== undefined) {
      this.subscribeToSaveResponse(this.jobPositionService.update(jobPosition));
    } else {
      this.subscribeToSaveResponse(this.jobPositionService.create(jobPosition));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobPosition>>): void {
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

  protected updateForm(jobPosition: IJobPosition): void {
    this.editForm.patchValue({
      id: jobPosition.id,
      code: jobPosition.code,
      name: jobPosition.name,
      description: jobPosition.description,
    });
  }

  protected createFromForm(): IJobPosition {
    return {
      ...new JobPosition(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
