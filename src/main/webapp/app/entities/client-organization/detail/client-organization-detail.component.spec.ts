import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ClientOrganizationDetailComponent } from './client-organization-detail.component';

describe('Component Tests', () => {
  describe('ClientOrganization Management Detail Component', () => {
    let comp: ClientOrganizationDetailComponent;
    let fixture: ComponentFixture<ClientOrganizationDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ClientOrganizationDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ clientOrganization: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ClientOrganizationDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ClientOrganizationDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load clientOrganization on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.clientOrganization).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
