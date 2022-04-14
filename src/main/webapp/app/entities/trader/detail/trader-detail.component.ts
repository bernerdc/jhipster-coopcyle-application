import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITrader } from '../trader.model';

@Component({
  selector: 'jhi-trader-detail',
  templateUrl: './trader-detail.component.html',
})
export class TraderDetailComponent implements OnInit {
  trader: ITrader | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ trader }) => {
      this.trader = trader;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
