jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ApplicantService } from '../service/applicant.service';
import { IApplicant, Applicant } from '../applicant.model';

import { ApplicantUpdateComponent } from './applicant-update.component';

describe('Component Tests', () => {
  describe('Applicant Management Update Component', () => {
    let comp: ApplicantUpdateComponent;
    let fixture: ComponentFixture<ApplicantUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let applicantService: ApplicantService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ApplicantUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ApplicantUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ApplicantUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      applicantService = TestBed.inject(ApplicantService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const applicant: IApplicant = { id: 456 };

        activatedRoute.data = of({ applicant });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(applicant));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const applicant = { id: 123 };
        spyOn(applicantService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ applicant });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: applicant }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(applicantService.update).toHaveBeenCalledWith(applicant);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const applicant = new Applicant();
        spyOn(applicantService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ applicant });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: applicant }));
        saveSubject.complete();

        // THEN
        expect(applicantService.create).toHaveBeenCalledWith(applicant);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const applicant = { id: 123 };
        spyOn(applicantService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ applicant });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(applicantService.update).toHaveBeenCalledWith(applicant);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
