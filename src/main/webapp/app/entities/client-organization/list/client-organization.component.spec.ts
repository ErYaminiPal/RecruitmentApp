import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ClientOrganizationService } from '../service/client-organization.service';

import { ClientOrganizationComponent } from './client-organization.component';

describe('Component Tests', () => {
  describe('ClientOrganization Management Component', () => {
    let comp: ClientOrganizationComponent;
    let fixture: ComponentFixture<ClientOrganizationComponent>;
    let service: ClientOrganizationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ClientOrganizationComponent],
      })
        .overrideTemplate(ClientOrganizationComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ClientOrganizationComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ClientOrganizationService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.clientOrganizations?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
