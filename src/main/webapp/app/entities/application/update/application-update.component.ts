import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IApplication, Application } from '../application.model';
import { ApplicationService } from '../service/application.service';
import { IApplicant } from 'app/entities/applicant/applicant.model';
import { ApplicantService } from 'app/entities/applicant/service/applicant.service';
import { IJobs } from 'app/entities/jobs/jobs.model';
import { JobsService } from 'app/entities/jobs/service/jobs.service';

@Component({
  selector: 'jhi-application-update',
  templateUrl: './application-update.component.html',
})
export class ApplicationUpdateComponent implements OnInit {
  isSaving = false;

  applicantsSharedCollection: IApplicant[] = [];
  jobsSharedCollection: IJobs[] = [];

  editForm = this.fb.group({
    id: [],
    dateOfApplication: [],
    education: [],
    experience: [],
    otherInfo: [],
    name: [],
    applicant: [],
    jobs: [],
  });

  constructor(
    protected applicationService: ApplicationService,
    protected applicantService: ApplicantService,
    protected jobsService: JobsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ application }) => {
      this.updateForm(application);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const application = this.createFromForm();
    if (application.id !== undefined) {
      this.subscribeToSaveResponse(this.applicationService.update(application));
    } else {
      this.subscribeToSaveResponse(this.applicationService.create(application));
    }
  }

  trackApplicantById(index: number, item: IApplicant): number {
    return item.id!;
  }

  trackJobsById(index: number, item: IJobs): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IApplication>>): void {
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

  protected updateForm(application: IApplication): void {
    this.editForm.patchValue({
      id: application.id,
      dateOfApplication: application.dateOfApplication,
      education: application.education,
      experience: application.experience,
      otherInfo: application.otherInfo,
      name: application.name,
      applicant: application.applicant,
      jobs: application.jobs,
    });

    this.applicantsSharedCollection = this.applicantService.addApplicantToCollectionIfMissing(
      this.applicantsSharedCollection,
      application.applicant
    );
    this.jobsSharedCollection = this.jobsService.addJobsToCollectionIfMissing(this.jobsSharedCollection, application.jobs);
  }

  protected loadRelationshipsOptions(): void {
    this.applicantService
      .query()
      .pipe(map((res: HttpResponse<IApplicant[]>) => res.body ?? []))
      .pipe(
        map((applicants: IApplicant[]) =>
          this.applicantService.addApplicantToCollectionIfMissing(applicants, this.editForm.get('applicant')!.value)
        )
      )
      .subscribe((applicants: IApplicant[]) => (this.applicantsSharedCollection = applicants));

    this.jobsService
      .query()
      .pipe(map((res: HttpResponse<IJobs[]>) => res.body ?? []))
      .pipe(map((jobs: IJobs[]) => this.jobsService.addJobsToCollectionIfMissing(jobs, this.editForm.get('jobs')!.value)))
      .subscribe((jobs: IJobs[]) => (this.jobsSharedCollection = jobs));
  }

  protected createFromForm(): IApplication {
    return {
      ...new Application(),
      id: this.editForm.get(['id'])!.value,
      dateOfApplication: this.editForm.get(['dateOfApplication'])!.value,
      education: this.editForm.get(['education'])!.value,
      experience: this.editForm.get(['experience'])!.value,
      otherInfo: this.editForm.get(['otherInfo'])!.value,
      name: this.editForm.get(['name'])!.value,
      applicant: this.editForm.get(['applicant'])!.value,
      jobs: this.editForm.get(['jobs'])!.value,
    };
  }
}
