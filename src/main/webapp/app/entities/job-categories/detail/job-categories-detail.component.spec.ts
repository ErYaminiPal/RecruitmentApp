import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JobCategoriesDetailComponent } from './job-categories-detail.component';

describe('Component Tests', () => {
  describe('JobCategories Management Detail Component', () => {
    let comp: JobCategoriesDetailComponent;
    let fixture: ComponentFixture<JobCategoriesDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [JobCategoriesDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ jobCategories: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(JobCategoriesDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(JobCategoriesDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load jobCategories on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.jobCategories).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
