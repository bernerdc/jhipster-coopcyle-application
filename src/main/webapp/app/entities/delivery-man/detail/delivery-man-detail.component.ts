import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDeliveryMan } from '../delivery-man.model';

@Component({
  selector: 'jhi-delivery-man-detail',
  templateUrl: './delivery-man-detail.component.html',
})
export class DeliveryManDetailComponent implements OnInit {
  deliveryMan: IDeliveryMan | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ deliveryMan }) => {
      this.deliveryMan = deliveryMan;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
