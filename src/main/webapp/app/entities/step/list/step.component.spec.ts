import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { StepService } from '../service/step.service';

import { StepComponent } from './step.component';

describe('Component Tests', () => {
  describe('Step Management Component', () => {
    let comp: StepComponent;
    let fixture: ComponentFixture<StepComponent>;
    let service: StepService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [StepComponent],
      })
        .overrideTemplate(StepComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(StepComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(StepService);

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
      expect(comp.steps?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
