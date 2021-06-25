jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IJobs, Jobs } from '../jobs.model';
import { JobsService } from '../service/jobs.service';

import { JobsRoutingResolveService } from './jobs-routing-resolve.service';

describe('Service Tests', () => {
  describe('Jobs routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: JobsRoutingResolveService;
    let service: JobsService;
    let resultJobs: IJobs | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(JobsRoutingResolveService);
      service = TestBed.inject(JobsService);
      resultJobs = undefined;
    });

    describe('resolve', () => {
      it('should return IJobs returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJobs = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJobs).toEqual({ id: 123 });
      });

      it('should return new IJobs if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJobs = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultJobs).toEqual(new Jobs());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJobs = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJobs).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
