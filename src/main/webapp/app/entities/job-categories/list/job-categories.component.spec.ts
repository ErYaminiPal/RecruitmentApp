import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { JobCategoriesService } from '../service/job-categories.service';

import { JobCategoriesComponent } from './job-categories.component';

describe('Component Tests', () => {
  describe('JobCategories Management Component', () => {
    let comp: JobCategoriesComponent;
    let fixture: ComponentFixture<JobCategoriesComponent>;
    let service: JobCategoriesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JobCategoriesComponent],
      })
        .overrideTemplate(JobCategoriesComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JobCategoriesComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(JobCategoriesService);

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
      expect(comp.jobCategories?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
