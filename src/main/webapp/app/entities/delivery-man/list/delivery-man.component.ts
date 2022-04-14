import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDeliveryMan } from '../delivery-man.model';
import { DeliveryManService } from '../service/delivery-man.service';
import { DeliveryManDeleteDialogComponent } from '../delete/delivery-man-delete-dialog.component';

@Component({
  selector: 'jhi-delivery-man',
  templateUrl: './delivery-man.component.html',
})
export class DeliveryManComponent implements OnInit {
  deliveryMen?: IDeliveryMan[];
  isLoading = false;

  constructor(protected deliveryManService: DeliveryManService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.deliveryManService.query().subscribe({
      next: (res: HttpResponse<IDeliveryMan[]>) => {
        this.isLoading = false;
        this.deliveryMen = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IDeliveryMan): number {
    return item.id!;
  }

  delete(deliveryMan: IDeliveryMan): void {
    const modalRef = this.modalService.open(DeliveryManDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.deliveryMan = deliveryMan;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
