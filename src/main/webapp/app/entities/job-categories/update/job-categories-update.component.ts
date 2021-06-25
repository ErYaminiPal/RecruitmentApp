import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IJobCategories, JobCategories } from '../job-categories.model';
import { JobCategoriesService } from '../service/job-categories.service';

@Component({
  selector: 'jhi-job-categories-update',
  templateUrl: './job-categories-update.component.html',
})
export class JobCategoriesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    code: [],
    name: [],
    description: [],
  });

  constructor(protected jobCategoriesService: JobCategoriesService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobCategories }) => {
      this.updateForm(jobCategories);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jobCategories = this.createFromForm();
    if (jobCategories.id !== undefined) {
      this.subscribeToSaveResponse(this.jobCategoriesService.update(jobCategories));
    } else {
      this.subscribeToSaveResponse(this.jobCategoriesService.create(jobCategories));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobCategories>>): void {
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

  protected updateForm(jobCategories: IJobCategories): void {
    this.editForm.patchValue({
      id: jobCategories.id,
      code: jobCategories.code,
      name: jobCategories.name,
      description: jobCategories.description,
    });
  }

  protected createFromForm(): IJobCategories {
    return {
      ...new JobCategories(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
