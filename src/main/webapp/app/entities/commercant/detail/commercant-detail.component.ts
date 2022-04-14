import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICommercant } from '../commercant.model';

@Component({
  selector: 'jhi-commercant-detail',
  templateUrl: './commercant-detail.component.html',
})
export class CommercantDetailComponent implements OnInit {
  commercant: ICommercant | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ commercant }) => {
      this.commercant = commercant;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
