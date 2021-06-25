import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IJobs, Jobs } from '../jobs.model';
import { JobsService } from '../service/jobs.service';
import { IJobCategories } from 'app/entities/job-categories/job-categories.model';
import { JobCategoriesService } from 'app/entities/job-categories/service/job-categories.service';
import { IJobPosition } from 'app/entities/job-position/job-position.model';
import { JobPositionService } from 'app/entities/job-position/service/job-position.service';
import { IClientOrganization } from 'app/entities/client-organization/client-organization.model';
import { ClientOrganizationService } from 'app/entities/client-organization/service/client-organization.service';
import { IProcess } from 'app/entities/process/process.model';
import { ProcessService } from 'app/entities/process/service/process.service';

@Component({
  selector: 'jhi-jobs-update',
  templateUrl: './jobs-update.component.html',
})
export class JobsUpdateComponent implements OnInit {
  isSaving = false;

  jobCategoriesSharedCollection: IJobCategories[] = [];
  jobPositionsSharedCollection: IJobPosition[] = [];
  clientOrganizationsSharedCollection: IClientOrganization[] = [];
  processesSharedCollection: IProcess[] = [];

  editForm = this.fb.group({
    id: [],
    code: [],
    name: [],
    description: [],
    datePublished: [],
    jobStartDate: [],
    noOfVacancies: [],
    jobCategories: [],
    jobPosition: [],
    clientOrganization: [],
    process: [],
  });

  constructor(
    protected jobsService: JobsService,
    protected jobCategoriesService: JobCategoriesService,
    protected jobPositionService: JobPositionService,
    protected clientOrganizationService: ClientOrganizationService,
    protected processService: ProcessService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobs }) => {
      this.updateForm(jobs);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jobs = this.createFromForm();
    if (jobs.id !== undefined) {
      this.subscribeToSaveResponse(this.jobsService.update(jobs));
    } else {
      this.subscribeToSaveResponse(this.jobsService.create(jobs));
    }
  }

  trackJobCategoriesById(index: number, item: IJobCategories): number {
    return item.id!;
  }

  trackJobPositionById(index: number, item: IJobPosition): number {
    return item.id!;
  }

  trackClientOrganizationById(index: number, item: IClientOrganization): number {
    return item.id!;
  }

  trackProcessById(index: number, item: IProcess): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobs>>): void {
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

  protected updateForm(jobs: IJobs): void {
    this.editForm.patchValue({
      id: jobs.id,
      code: jobs.code,
      name: jobs.name,
      description: jobs.description,
      datePublished: jobs.datePublished,
      jobStartDate: jobs.jobStartDate,
      noOfVacancies: jobs.noOfVacancies,
      jobCategories: jobs.jobCategories,
      jobPosition: jobs.jobPosition,
      clientOrganization: jobs.clientOrganization,
      process: jobs.process,
    });

    this.jobCategoriesSharedCollection = this.jobCategoriesService.addJobCategoriesToCollectionIfMissing(
      this.jobCategoriesSharedCollection,
      jobs.jobCategories
    );
    this.jobPositionsSharedCollection = this.jobPositionService.addJobPositionToCollectionIfMissing(
      this.jobPositionsSharedCollection,
      jobs.jobPosition
    );
    this.clientOrganizationsSharedCollection = this.clientOrganizationService.addClientOrganizationToCollectionIfMissing(
      this.clientOrganizationsSharedCollection,
      jobs.clientOrganization
    );
    this.processesSharedCollection = this.processService.addProcessToCollectionIfMissing(this.processesSharedCollection, jobs.process);
  }

  protected loadRelationshipsOptions(): void {
    this.jobCategoriesService
      .query()
      .pipe(map((res: HttpResponse<IJobCategories[]>) => res.body ?? []))
      .pipe(
        map((jobCategories: IJobCategories[]) =>
          this.jobCategoriesService.addJobCategoriesToCollectionIfMissing(jobCategories, this.editForm.get('jobCategories')!.value)
        )
      )
      .subscribe((jobCategories: IJobCategories[]) => (this.jobCategoriesSharedCollection = jobCategories));

    this.jobPositionService
      .query()
      .pipe(map((res: HttpResponse<IJobPosition[]>) => res.body ?? []))
      .pipe(
        map((jobPositions: IJobPosition[]) =>
          this.jobPositionService.addJobPositionToCollectionIfMissing(jobPositions, this.editForm.get('jobPosition')!.value)
        )
      )
      .subscribe((jobPositions: IJobPosition[]) => (this.jobPositionsSharedCollection = jobPositions));

    this.clientOrganizationService
      .query()
      .pipe(map((res: HttpResponse<IClientOrganization[]>) => res.body ?? []))
      .pipe(
        map((clientOrganizations: IClientOrganization[]) =>
          this.clientOrganizationService.addClientOrganizationToCollectionIfMissing(
            clientOrganizations,
            this.editForm.get('clientOrganization')!.value
          )
        )
      )
      .subscribe((clientOrganizations: IClientOrganization[]) => (this.clientOrganizationsSharedCollection = clientOrganizations));

    this.processService
      .query()
      .pipe(map((res: HttpResponse<IProcess[]>) => res.body ?? []))
      .pipe(
        map((processes: IProcess[]) => this.processService.addProcessToCollectionIfMissing(processes, this.editForm.get('process')!.value))
      )
      .subscribe((processes: IProcess[]) => (this.processesSharedCollection = processes));
  }

  protected createFromForm(): IJobs {
    return {
      ...new Jobs(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      datePublished: this.editForm.get(['datePublished'])!.value,
      jobStartDate: this.editForm.get(['jobStartDate'])!.value,
      noOfVacancies: this.editForm.get(['noOfVacancies'])!.value,
      jobCategories: this.editForm.get(['jobCategories'])!.value,
      jobPosition: this.editForm.get(['jobPosition'])!.value,
      clientOrganization: this.editForm.get(['clientOrganization'])!.value,
      process: this.editForm.get(['process'])!.value,
    };
  }
}
