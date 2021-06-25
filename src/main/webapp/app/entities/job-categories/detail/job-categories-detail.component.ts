import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJobCategories } from '../job-categories.model';

@Component({
  selector: 'jhi-job-categories-detail',
  templateUrl: './job-categories-detail.component.html',
})
export class JobCategoriesDetailComponent implements OnInit {
  jobCategories: IJobCategories | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobCategories }) => {
      this.jobCategories = jobCategories;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
