import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JobPositionDetailComponent } from './job-position-detail.component';

describe('Component Tests', () => {
  describe('JobPosition Management Detail Component', () => {
    let comp: JobPositionDetailComponent;
    let fixture: ComponentFixture<JobPositionDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [JobPositionDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ jobPosition: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(JobPositionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(JobPositionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load jobPosition on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.jobPosition).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
