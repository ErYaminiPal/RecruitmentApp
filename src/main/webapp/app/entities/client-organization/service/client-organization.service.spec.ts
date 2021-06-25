import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IClientOrganization, ClientOrganization } from '../client-organization.model';

import { ClientOrganizationService } from './client-organization.service';

describe('Service Tests', () => {
  describe('ClientOrganization Service', () => {
    let service: ClientOrganizationService;
    let httpMock: HttpTestingController;
    let elemDefault: IClientOrganization;
    let expectedResult: IClientOrganization | IClientOrganization[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ClientOrganizationService);
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

      it('should create a ClientOrganization', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new ClientOrganization()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ClientOrganization', () => {
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

      it('should partial update a ClientOrganization', () => {
        const patchObject = Object.assign(
          {
            code: 'BBBBBB',
            name: 'BBBBBB',
          },
          new ClientOrganization()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ClientOrganization', () => {
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

      it('should delete a ClientOrganization', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addClientOrganizationToCollectionIfMissing', () => {
        it('should add a ClientOrganization to an empty array', () => {
          const clientOrganization: IClientOrganization = { id: 123 };
          expectedResult = service.addClientOrganizationToCollectionIfMissing([], clientOrganization);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(clientOrganization);
        });

        it('should not add a ClientOrganization to an array that contains it', () => {
          const clientOrganization: IClientOrganization = { id: 123 };
          const clientOrganizationCollection: IClientOrganization[] = [
            {
              ...clientOrganization,
            },
            { id: 456 },
          ];
          expectedResult = service.addClientOrganizationToCollectionIfMissing(clientOrganizationCollection, clientOrganization);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ClientOrganization to an array that doesn't contain it", () => {
          const clientOrganization: IClientOrganization = { id: 123 };
          const clientOrganizationCollection: IClientOrganization[] = [{ id: 456 }];
          expectedResult = service.addClientOrganizationToCollectionIfMissing(clientOrganizationCollection, clientOrganization);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(clientOrganization);
        });

        it('should add only unique ClientOrganization to an array', () => {
          const clientOrganizationArray: IClientOrganization[] = [{ id: 123 }, { id: 456 }, { id: 65038 }];
          const clientOrganizationCollection: IClientOrganization[] = [{ id: 123 }];
          expectedResult = service.addClientOrganizationToCollectionIfMissing(clientOrganizationCollection, ...clientOrganizationArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const clientOrganization: IClientOrganization = { id: 123 };
          const clientOrganization2: IClientOrganization = { id: 456 };
          expectedResult = service.addClientOrganizationToCollectionIfMissing([], clientOrganization, clientOrganization2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(clientOrganization);
          expect(expectedResult).toContain(clientOrganization2);
        });

        it('should accept null and undefined values', () => {
          const clientOrganization: IClientOrganization = { id: 123 };
          expectedResult = service.addClientOrganizationToCollectionIfMissing([], null, clientOrganization, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(clientOrganization);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
