import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDeliveryMan } from '../delivery-man.model';
import { DeliveryManService } from '../service/delivery-man.service';

@Component({
  templateUrl: './delivery-man-delete-dialog.component.html',
})
export class DeliveryManDeleteDialogComponent {
  deliveryMan?: IDeliveryMan;

  constructor(protected deliveryManService: DeliveryManService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.deliveryManService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
