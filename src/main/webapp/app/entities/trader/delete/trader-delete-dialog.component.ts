import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITrader } from '../trader.model';
import { TraderService } from '../service/trader.service';

@Component({
  templateUrl: './trader-delete-dialog.component.html',
})
export class TraderDeleteDialogComponent {
  trader?: ITrader;

  constructor(protected traderService: TraderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.traderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
