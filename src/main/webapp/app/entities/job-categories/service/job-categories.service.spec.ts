import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IJobCategories, JobCategories } from '../job-categories.model';

import { JobCategoriesService } from './job-categories.service';

describe('Service Tests', () => {
  describe('JobCategories Service', () => {
    let service: JobCategoriesService;
    let httpMock: HttpTestingController;
    let elemDefault: IJobCategories;
    let expectedResult: IJobCategories | IJobCategories[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(JobCategoriesService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        code: 'AAAAAAA',
        name: 'AAAAAAA',
        description: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a JobCategories', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new JobCategories()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a JobCategories', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            code: 'BBBBBB',
            name: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a JobCategories', () => {
        const patchObject = Object.assign(
          {
            code: 'BBBBBB',
            name: 'BBBBBB',
            description: 'BBBBBB',
          },
          new JobCategories()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of JobCategories', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            code: 'BBBBBB',
            name: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a JobCategories', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addJobCategoriesToCollectionIfMissing', () => {
        it('should add a JobCategories to an empty array', () => {
          const jobCategories: IJobCategories = { id: 123 };
          expectedResult = service.addJobCategoriesToCollectionIfMissing([], jobCategories);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(jobCategories);
        });

        it('should not add a JobCategories to an array that contains it', () => {
          const jobCategories: IJobCategories = { id: 123 };
          const jobCategoriesCollection: IJobCategories[] = [
            {
              ...jobCategories,
            },
            { id: 456 },
          ];
          expectedResult = service.addJobCategoriesToCollectionIfMissing(jobCategoriesCollection, jobCategories);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a JobCategories to an array that doesn't contain it", () => {
          const jobCategories: IJobCategories = { id: 123 };
          const jobCategoriesCollection: IJobCategories[] = [{ id: 456 }];
          expectedResult = service.addJobCategoriesToCollectionIfMissing(jobCategoriesCollection, jobCategories);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(jobCategories);
        });

        it('should add only unique JobCategories to an array', () => {
          const jobCategoriesArray: IJobCategories[] = [{ id: 123 }, { id: 456 }, { id: 7252 }];
          const jobCategoriesCollection: IJobCategories[] = [{ id: 123 }];
          expectedResult = service.addJobCategoriesToCollectionIfMissing(jobCategoriesCollection, ...jobCategoriesArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const jobCategories: IJobCategories = { id: 123 };
          const jobCategories2: IJobCategories = { id: 456 };
          expectedResult = service.addJobCategoriesToCollectionIfMissing([], jobCategories, jobCategories2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(jobCategories);
          expect(expectedResult).toContain(jobCategories2);
        });

        it('should accept null and undefined values', () => {
          const jobCategories: IJobCategories = { id: 123 };
          expectedResult = service.addJobCategoriesToCollectionIfMissing([], null, jobCategories, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(jobCategories);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
