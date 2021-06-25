jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IJobCategories, JobCategories } from '../job-categories.model';
import { JobCategoriesService } from '../service/job-categories.service';

import { JobCategoriesRoutingResolveService } from './job-categories-routing-resolve.service';

describe('Service Tests', () => {
  describe('JobCategories routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: JobCategoriesRoutingResolveService;
    let service: JobCategoriesService;
    let resultJobCategories: IJobCategories | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(JobCategoriesRoutingResolveService);
      service = TestBed.inject(JobCategoriesService);
      resultJobCategories = undefined;
    });

    describe('resolve', () => {
      it('should return IJobCategories returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJobCategories = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJobCategories).toEqual({ id: 123 });
      });

      it('should return new IJobCategories if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJobCategories = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultJobCategories).toEqual(new JobCategories());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultJobCategories = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultJobCategories).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
