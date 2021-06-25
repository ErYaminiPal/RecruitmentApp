jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { JobPositionService } from '../service/job-position.service';
import { IJobPosition, JobPosition } from '../job-position.model';

import { JobPositionUpdateComponent } from './job-position-update.component';

describe('Component Tests', () => {
  describe('JobPosition Management Update Component', () => {
    let comp: JobPositionUpdateComponent;
    let fixture: ComponentFixture<JobPositionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let jobPositionService: JobPositionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JobPositionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(JobPositionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JobPositionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      jobPositionService = TestBed.inject(JobPositionService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const jobPosition: IJobPosition = { id: 456 };

        activatedRoute.data = of({ jobPosition });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(jobPosition));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jobPosition = { id: 123 };
        spyOn(jobPositionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jobPosition });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: jobPosition }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(jobPositionService.update).toHaveBeenCalledWith(jobPosition);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jobPosition = new JobPosition();
        spyOn(jobPositionService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jobPosition });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: jobPosition }));
        saveSubject.complete();

        // THEN
        expect(jobPositionService.create).toHaveBeenCalledWith(jobPosition);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jobPosition = { id: 123 };
        spyOn(jobPositionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jobPosition });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(jobPositionService.update).toHaveBeenCalledWith(jobPosition);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
