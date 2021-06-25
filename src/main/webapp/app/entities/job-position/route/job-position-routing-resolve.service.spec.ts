jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IJobPosition, JobPosition } from '../job-position.model';
import { JobPositionService } from '../service/job-position.service';

import { JobPositionRoutingResolveService } from './job-position-routing-resolve.service';

describe('Service Tests', () => {
  describe('JobPosition routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: JobPositionRoutingResolveService;
    let service: JobPositionService;
    let resultJobPosition: IJobPosition | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(JobPositionRoutingResolveService);
      service = TestBed.inject(JobPositionService);
      resultJobPosition = undefined;
    });

    describe('resolve', () => {
      it('should return IJobPosition returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJobPosition = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJobPosition).toEqual({ id: 123 });
      });

      it('should return new IJobPosition if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJobPosition = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultJobPosition).toEqual(new JobPosition());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJobPosition = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJobPosition).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
