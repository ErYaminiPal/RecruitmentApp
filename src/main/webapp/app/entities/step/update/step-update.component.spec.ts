jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { StepService } from '../service/step.service';
import { IStep, Step } from '../step.model';
import { IProcess } from 'app/entities/process/process.model';
import { ProcessService } from 'app/entities/process/service/process.service';

import { StepUpdateComponent } from './step-update.component';

describe('Component Tests', () => {
  describe('Step Management Update Component', () => {
    let comp: StepUpdateComponent;
    let fixture: ComponentFixture<StepUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let stepService: StepService;
    let processService: ProcessService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [StepUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(StepUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(StepUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      stepService = TestBed.inject(StepService);
      processService = TestBed.inject(ProcessService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Process query and add missing value', () => {
        const step: IStep = { id: 456 };
        const process: IProcess = { id: 99772 };
        step.process = process;

        const processCollection: IProcess[] = [{ id: 48603 }];
        spyOn(processService, 'query').and.returnValue(of(new HttpResponse({ body: processCollection })));
        const additionalProcesses = [process];
        const expectedCollection: IProcess[] = [...additionalProcesses, ...processCollection];
        spyOn(processService, 'addProcessToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ step });
        comp.ngOnInit();

        expect(processService.query).toHaveBeenCalled();
        expect(processService.addProcessToCollectionIfMissing).toHaveBeenCalledWith(processCollection, ...additionalProcesses);
        expect(comp.processesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const step: IStep = { id: 456 };
        const process: IProcess = { id: 34053 };
        step.process = process;

        activatedRoute.data = of({ step });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(step));
        expect(comp.processesSharedCollection).toContain(process);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const step = { id: 123 };
        spyOn(stepService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ step });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: step }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(stepService.update).toHaveBeenCalledWith(step);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const step = new Step();
        spyOn(stepService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ step });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: step }));
        saveSubject.complete();

        // THEN
        expect(stepService.create).toHaveBeenCalledWith(step);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const step = { id: 123 };
        spyOn(stepService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ step });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(stepService.update).toHaveBeenCalledWith(step);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
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
