jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ClientOrganizationService } from '../service/client-organization.service';
import { IClientOrganization, ClientOrganization } from '../client-organization.model';

import { ClientOrganizationUpdateComponent } from './client-organization-update.component';

describe('Component Tests', () => {
  describe('ClientOrganization Management Update Component', () => {
    let comp: ClientOrganizationUpdateComponent;
    let fixture: ComponentFixture<ClientOrganizationUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let clientOrganizationService: ClientOrganizationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ClientOrganizationUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ClientOrganizationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ClientOrganizationUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      clientOrganizationService = TestBed.inject(ClientOrganizationService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const clientOrganization: IClientOrganization = { id: 456 };

        activatedRoute.data = of({ clientOrganization });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(clientOrganization));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const clientOrganization = { id: 123 };
        spyOn(clientOrganizationService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ clientOrganization });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: clientOrganization }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(clientOrganizationService.update).toHaveBeenCalledWith(clientOrganization);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const clientOrganization = new ClientOrganization();
        spyOn(clientOrganizationService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ clientOrganization });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: clientOrganization }));
        saveSubject.complete();

        // THEN
        expect(clientOrganizationService.create).toHaveBeenCalledWith(clientOrganization);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const clientOrganization = { id: 123 };
        spyOn(clientOrganizationService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ clientOrganization });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(clientOrganizationService.update).toHaveBeenCalledWith(clientOrganization);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
