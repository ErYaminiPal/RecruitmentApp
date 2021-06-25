jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ApplicationService } from '../service/application.service';
import { IApplication, Application } from '../application.model';
import { IApplicant } from 'app/entities/applicant/applicant.model';
import { ApplicantService } from 'app/entities/applicant/service/applicant.service';
import { IJobs } from 'app/entities/jobs/jobs.model';
import { JobsService } from 'app/entities/jobs/service/jobs.service';

import { ApplicationUpdateComponent } from './application-update.component';

describe('Component Tests', () => {
  describe('Application Management Update Component', () => {
    let comp: ApplicationUpdateComponent;
    let fixture: ComponentFixture<ApplicationUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let applicationService: ApplicationService;
    let applicantService: ApplicantService;
    let jobsService: JobsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ApplicationUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ApplicationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ApplicationUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      applicationService = TestBed.inject(ApplicationService);
      applicantService = TestBed.inject(ApplicantService);
      jobsService = TestBed.inject(JobsService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Applicant query and add missing value', () => {
        const application: IApplication = { id: 456 };
        const applicant: IApplicant = { id: 3143 };
        application.applicant = applicant;

        const applicantCollection: IApplicant[] = [{ id: 99056 }];
        spyOn(applicantService, 'query').and.returnValue(of(new HttpResponse({ body: applicantCollection })));
        const additionalApplicants = [applicant];
        const expectedCollection: IApplicant[] = [...additionalApplicants, ...applicantCollection];
        spyOn(applicantService, 'addApplicantToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ application });
        comp.ngOnInit();

        expect(applicantService.query).toHaveBeenCalled();
        expect(applicantService.addApplicantToCollectionIfMissing).toHaveBeenCalledWith(applicantCollection, ...additionalApplicants);
        expect(comp.applicantsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Jobs query and add missing value', () => {
        const application: IApplication = { id: 456 };
        const jobs: IJobs = { id: 13556 };
        application.jobs = jobs;

        const jobsCollection: IJobs[] = [{ id: 82241 }];
        spyOn(jobsService, 'query').and.returnValue(of(new HttpResponse({ body: jobsCollection })));
        const additionalJobs = [jobs];
        const expectedCollection: IJobs[] = [...additionalJobs, ...jobsCollection];
        spyOn(jobsService, 'addJobsToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ application });
        comp.ngOnInit();

        expect(jobsService.query).toHaveBeenCalled();
        expect(jobsService.addJobsToCollectionIfMissing).toHaveBeenCalledWith(jobsCollection, ...additionalJobs);
        expect(comp.jobsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const application: IApplication = { id: 456 };
        const applicant: IApplicant = { id: 78042 };
        application.applicant = applicant;
        const jobs: IJobs = { id: 97218 };
        application.jobs = jobs;

        activatedRoute.data = of({ application });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(application));
        expect(comp.applicantsSharedCollection).toContain(applicant);
        expect(comp.jobsSharedCollection).toContain(jobs);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const application = { id: 123 };
        spyOn(applicationService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ application });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: application }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(applicationService.update).toHaveBeenCalledWith(application);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const application = new Application();
        spyOn(applicationService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ application });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: application }));
        saveSubject.complete();

        // THEN
        expect(applicationService.create).toHaveBeenCalledWith(application);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const application = { id: 123 };
        spyOn(applicationService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ application });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(applicationService.update).toHaveBeenCalledWith(application);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackApplicantById', () => {
        it('Should return tracked Applicant primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackApplicantById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackJobsById', () => {
        it('Should return tracked Jobs primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackJobsById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
