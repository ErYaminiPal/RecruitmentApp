import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStep, Step } from '../step.model';

import { StepService } from './step.service';

describe('Service Tests', () => {
  describe('Step Service', () => {
    let service: StepService;
    let httpMock: HttpTestingController;
    let elemDefault: IStep;
    let expectedResult: IStep | IStep[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(StepService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        code: 'AAAAAAA',
        name: 'AAAAAAA',
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

      it('should create a Step', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Step()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Step', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            code: 'BBBBBB',
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Step', () => {
        const patchObject = Object.assign({}, new Step());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Step', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            code: 'BBBBBB',
            name: 'BBBBBB',
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

      it('should delete a Step', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addStepToCollectionIfMissing', () => {
        it('should add a Step to an empty array', () => {
          const step: IStep = { id: 123 };
          expectedResult = service.addStepToCollectionIfMissing([], step);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(step);
        });

        it('should not add a Step to an array that contains it', () => {
          const step: IStep = { id: 123 };
          const stepCollection: IStep[] = [
            {
              ...step,
            },
            { id: 456 },
          ];
          expectedResult = service.addStepToCollectionIfMissing(stepCollection, step);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Step to an array that doesn't contain it", () => {
          const step: IStep = { id: 123 };
          const stepCollection: IStep[] = [{ id: 456 }];
          expectedResult = service.addStepToCollectionIfMissing(stepCollection, step);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(step);
        });

        it('should add only unique Step to an array', () => {
          const stepArray: IStep[] = [{ id: 123 }, { id: 456 }, { id: 40574 }];
          const stepCollection: IStep[] = [{ id: 123 }];
          expectedResult = service.addStepToCollectionIfMissing(stepCollection, ...stepArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const step: IStep = { id: 123 };
          const step2: IStep = { id: 456 };
          expectedResult = service.addStepToCollectionIfMissing([], step, step2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(step);
          expect(expectedResult).toContain(step2);
        });

        it('should accept null and undefined values', () => {
          const step: IStep = { id: 123 };
          expectedResult = service.addStepToCollectionIfMissing([], null, step, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(step);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
