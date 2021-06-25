import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IJobPosition, JobPosition } from '../job-position.model';

import { JobPositionService } from './job-position.service';

describe('Service Tests', () => {
  describe('JobPosition Service', () => {
    let service: JobPositionService;
    let httpMock: HttpTestingController;
    let elemDefault: IJobPosition;
    let expectedResult: IJobPosition | IJobPosition[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(JobPositionService);
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

      it('should create a JobPosition', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new JobPosition()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a JobPosition', () => {
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

      it('should partial update a JobPosition', () => {
        const patchObject = Object.assign(
          {
            description: 'BBBBBB',
          },
          new JobPosition()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of JobPosition', () => {
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

      it('should delete a JobPosition', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addJobPositionToCollectionIfMissing', () => {
        it('should add a JobPosition to an empty array', () => {
          const jobPosition: IJobPosition = { id: 123 };
          expectedResult = service.addJobPositionToCollectionIfMissing([], jobPosition);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(jobPosition);
        });

        it('should not add a JobPosition to an array that contains it', () => {
          const jobPosition: IJobPosition = { id: 123 };
          const jobPositionCollection: IJobPosition[] = [
            {
              ...jobPosition,
            },
            { id: 456 },
          ];
          expectedResult = service.addJobPositionToCollectionIfMissing(jobPositionCollection, jobPosition);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a JobPosition to an array that doesn't contain it", () => {
          const jobPosition: IJobPosition = { id: 123 };
          const jobPositionCollection: IJobPosition[] = [{ id: 456 }];
          expectedResult = service.addJobPositionToCollectionIfMissing(jobPositionCollection, jobPosition);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(jobPosition);
        });

        it('should add only unique JobPosition to an array', () => {
          const jobPositionArray: IJobPosition[] = [{ id: 123 }, { id: 456 }, { id: 73885 }];
          const jobPositionCollection: IJobPosition[] = [{ id: 123 }];
          expectedResult = service.addJobPositionToCollectionIfMissing(jobPositionCollection, ...jobPositionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const jobPosition: IJobPosition = { id: 123 };
          const jobPosition2: IJobPosition = { id: 456 };
          expectedResult = service.addJobPositionToCollectionIfMissing([], jobPosition, jobPosition2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(jobPosition);
          expect(expectedResult).toContain(jobPosition2);
        });

        it('should accept null and undefined values', () => {
          const jobPosition: IJobPosition = { id: 123 };
          expectedResult = service.addJobPositionToCollectionIfMissing([], null, jobPosition, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(jobPosition);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
