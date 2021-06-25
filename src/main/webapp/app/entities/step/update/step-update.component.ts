import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IStep, Step } from '../step.model';
import { StepService } from '../service/step.service';
import { IProcess } from 'app/entities/process/process.model';
import { ProcessService } from 'app/entities/process/service/process.service';

@Component({
  selector: 'jhi-step-update',
  templateUrl: './step-update.component.html',
})
export class StepUpdateComponent implements OnInit {
  isSaving = false;

  processesSharedCollection: IProcess[] = [];

  editForm = this.fb.group({
    id: [],
    code: [],
    name: [],
    process: [],
  });

  constructor(
    protected stepService: StepService,
    protected processService: ProcessService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ step }) => {
      this.updateForm(step);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const step = this.createFromForm();
    if (step.id !== undefined) {
      this.subscribeToSaveResponse(this.stepService.update(step));
    } else {
      this.subscribeToSaveResponse(this.stepService.create(step));
    }
  }

  trackProcessById(index: number, item: IProcess): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStep>>): void {
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

  protected updateForm(step: IStep): void {
    this.editForm.patchValue({
      id: step.id,
      code: step.code,
      name: step.name,
      process: step.process,
    });

    this.processesSharedCollection = this.processService.addProcessToCollectionIfMissing(this.processesSharedCollection, step.process);
  }

  protected loadRelationshipsOptions(): void {
    this.processService
      .query()
      .pipe(map((res: HttpResponse<IProcess[]>) => res.body ?? []))
      .pipe(
        map((processes: IProcess[]) => this.processService.addProcessToCollectionIfMissing(processes, this.editForm.get('process')!.value))
      )
      .subscribe((processes: IProcess[]) => (this.processesSharedCollection = processes));
  }

  protected createFromForm(): IStep {
    return {
      ...new Step(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      name: this.editForm.get(['name'])!.value,
      process: this.editForm.get(['process'])!.value,
    };
  }
}
