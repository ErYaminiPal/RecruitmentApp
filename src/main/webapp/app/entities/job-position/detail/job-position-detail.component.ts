import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IJobPosition } from '../job-position.model';

@Component({
  selector: 'jhi-job-position-detail',
  templateUrl: './job-position-detail.component.html',
})
export class JobPositionDetailComponent implements OnInit {
  jobPosition: IJobPosition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobPosition }) => {
      this.jobPosition = jobPosition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
