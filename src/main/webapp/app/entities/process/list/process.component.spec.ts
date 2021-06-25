import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProcessService } from '../service/process.service';

import { ProcessComponent } from './process.component';

describe('Component Tests', () => {
  describe('Process Management Component', () => {
    let comp: ProcessComponent;
    let fixture: ComponentFixture<ProcessComponent>;
    let service: ProcessService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProcessComponent],
      })
        .overrideTemplate(ProcessComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProcessComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ProcessService);

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
      expect(comp.processes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
