jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { JobsService } from '../service/jobs.service';
import { IJobs, Jobs } from '../jobs.model';
import { IJobCategories } from 'app/entities/job-categories/job-categories.model';
import { JobCategoriesService } from 'app/entities/job-categories/service/job-categories.service';
import { IJobPosition } from 'app/entities/job-position/job-position.model';
import { JobPositionService } from 'app/entities/job-position/service/job-position.service';
import { IClientOrganization } from 'app/entities/client-organization/client-organization.model';
import { ClientOrganizationService } from 'app/entities/client-organization/service/client-organization.service';
import { IProcess } from 'app/entities/process/process.model';
import { ProcessService } from 'app/entities/process/service/process.service';

import { JobsUpdateComponent } from './jobs-update.component';

describe('Component Tests', () => {
  describe('Jobs Management Update Component', () => {
    let comp: JobsUpdateComponent;
    let fixture: ComponentFixture<JobsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let jobsService: JobsService;
    let jobCategoriesService: JobCategoriesService;
    let jobPositionService: JobPositionService;
    let clientOrganizationService: ClientOrganizationService;
    let processService: ProcessService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JobsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(JobsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JobsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      jobsService = TestBed.inject(JobsService);
      jobCategoriesService = TestBed.inject(JobCategoriesService);
      jobPositionService = TestBed.inject(JobPositionService);
      clientOrganizationService = TestBed.inject(ClientOrganizationService);
      processService = TestBed.inject(ProcessService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call JobCategories query and add missing value', () => {
        const jobs: IJobs = { id: 456 };
        const jobCategories: IJobCategories = { id: 76517 };
        jobs.jobCategories = jobCategories;

        const jobCategoriesCollection: IJobCategories[] = [{ id: 29375 }];
        spyOn(jobCategoriesService, 'query').and.returnValue(of(new HttpResponse({ body: jobCategoriesCollection })));
        const additionalJobCategories = [jobCategories];
        const expectedCollection: IJobCategories[] = [...additionalJobCategories, ...jobCategoriesCollection];
        spyOn(jobCategoriesService, 'addJobCategoriesToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ jobs });
        comp.ngOnInit();

        expect(jobCategoriesService.query).toHaveBeenCalled();
        expect(jobCategoriesService.addJobCategoriesToCollectionIfMissing).toHaveBeenCalledWith(
          jobCategoriesCollection,
          ...additionalJobCategories
        );
        expect(comp.jobCategoriesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call JobPosition query and add missing value', () => {
        const jobs: IJobs = { id: 456 };
        const jobPosition: IJobPosition = { id: 84684 };
        jobs.jobPosition = jobPosition;

        const jobPositionCollection: IJobPosition[] = [{ id: 97767 }];
        spyOn(jobPositionService, 'query').and.returnValue(of(new HttpResponse({ body: jobPositionCollection })));
        const additionalJobPositions = [jobPosition];
        const expectedCollection: IJobPosition[] = [...additionalJobPositions, ...jobPositionCollection];
        spyOn(jobPositionService, 'addJobPositionToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ jobs });
        comp.ngOnInit();

        expect(jobPositionService.query).toHaveBeenCalled();
        expect(jobPositionService.addJobPositionToCollectionIfMissing).toHaveBeenCalledWith(
          jobPositionCollection,
          ...additionalJobPositions
        );
        expect(comp.jobPositionsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call ClientOrganization query and add missing value', () => {
        const jobs: IJobs = { id: 456 };
        const clientOrganization: IClientOrganization = { id: 39790 };
        jobs.clientOrganization = clientOrganization;

        const clientOrganizationCollection: IClientOrganization[] = [{ id: 35726 }];
        spyOn(clientOrganizationService, 'query').and.returnValue(of(new HttpResponse({ body: clientOrganizationCollection })));
        const additionalClientOrganizations = [clientOrganization];
        const expectedCollection: IClientOrganization[] = [...additionalClientOrganizations, ...clientOrganizationCollection];
        spyOn(clientOrganizationService, 'addClientOrganizationToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ jobs });
        comp.ngOnInit();

        expect(clientOrganizationService.query).toHaveBeenCalled();
        expect(clientOrganizationService.addClientOrganizationToCollectionIfMissing).toHaveBeenCalledWith(
          clientOrganizationCollection,
          ...additionalClientOrganizations
        );
        expect(comp.clientOrganizationsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Process query and add missing value', () => {
        const jobs: IJobs = { id: 456 };
        const process: IProcess = { id: 8185 };
        jobs.process = process;

        const processCollection: IProcess[] = [{ id: 65240 }];
        spyOn(processService, 'query').and.returnValue(of(new HttpResponse({ body: processCollection })));
        const additionalProcesses = [process];
        const expectedCollection: IProcess[] = [...additionalProcesses, ...processCollection];
        spyOn(processService, 'addProcessToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ jobs });
        comp.ngOnInit();

        expect(processService.query).toHaveBeenCalled();
        expect(processService.addProcessToCollectionIfMissing).toHaveBeenCalledWith(processCollection, ...additionalProcesses);
        expect(comp.processesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const jobs: IJobs = { id: 456 };
        const jobCategories: IJobCategories = { id: 37207 };
        jobs.jobCategories = jobCategories;
        const jobPosition: IJobPosition = { id: 46019 };
        jobs.jobPosition = jobPosition;
        const clientOrganization: IClientOrganization = { id: 65602 };
        jobs.clientOrganization = clientOrganization;
        const process: IProcess = { id: 23497 };
        jobs.process = process;

        activatedRoute.data = of({ jobs });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(jobs));
        expect(comp.jobCategoriesSharedCollection).toContain(jobCategories);
        expect(comp.jobPositionsSharedCollection).toContain(jobPosition);
        expect(comp.clientOrganizationsSharedCollection).toContain(clientOrganization);
        expect(comp.processesSharedCollection).toContain(process);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jobs = { id: 123 };
        spyOn(jobsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jobs });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: jobs }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(jobsService.update).toHaveBeenCalledWith(jobs);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jobs = new Jobs();
        spyOn(jobsService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jobs });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: jobs }));
        saveSubject.complete();

        // THEN
        expect(jobsService.create).toHaveBeenCalledWith(jobs);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jobs = { id: 123 };
        spyOn(jobsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jobs });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(jobsService.update).toHaveBeenCalledWith(jobs);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackJobCategoriesById', () => {
        it('Should return tracked JobCategories primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackJobCategoriesById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackJobPositionById', () => {
        it('Should return tracked JobPosition primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackJobPositionById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackClientOrganizationById', () => {
        it('Should return tracked ClientOrganization primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackClientOrganizationById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackProcessById', () => {
        it('Should return tracked Process primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackProcessById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
