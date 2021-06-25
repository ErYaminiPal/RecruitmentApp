jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { JobCategoriesService } from '../service/job-categories.service';
import { IJobCategories, JobCategories } from '../job-categories.model';

import { JobCategoriesUpdateComponent } from './job-categories-update.component';

describe('Component Tests', () => {
  describe('JobCategories Management Update Component', () => {
    let comp: JobCategoriesUpdateComponent;
    let fixture: ComponentFixture<JobCategoriesUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let jobCategoriesService: JobCategoriesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JobCategoriesUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(JobCategoriesUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JobCategoriesUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      jobCategoriesService = TestBed.inject(JobCategoriesService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const jobCategories: IJobCategories = { id: 456 };

        activatedRoute.data = of({ jobCategories });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(jobCategories));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jobCategories = { id: 123 };
        spyOn(jobCategoriesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jobCategories });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: jobCategories }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(jobCategoriesService.update).toHaveBeenCalledWith(jobCategories);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jobCategories = new JobCategories();
        spyOn(jobCategoriesService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jobCategories });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: jobCategories }));
        saveSubject.complete();

        // THEN
        expect(jobCategoriesService.create).toHaveBeenCalledWith(jobCategories);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jobCategories = { id: 123 };
        spyOn(jobCategoriesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jobCategories });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(jobCategoriesService.update).toHaveBeenCalledWith(jobCategories);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
