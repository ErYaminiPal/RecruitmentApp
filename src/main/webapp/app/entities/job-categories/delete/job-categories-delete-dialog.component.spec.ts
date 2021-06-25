jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { JobCategoriesService } from '../service/job-categories.service';

import { JobCategoriesDeleteDialogComponent } from './job-categories-delete-dialog.component';

describe('Component Tests', () => {
  describe('JobCategories Management Delete Component', () => {
    let comp: JobCategoriesDeleteDialogComponent;
    let fixture: ComponentFixture<JobCategoriesDeleteDialogComponent>;
    let service: JobCategoriesService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JobCategoriesDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(JobCategoriesDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(JobCategoriesDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(JobCategoriesService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
