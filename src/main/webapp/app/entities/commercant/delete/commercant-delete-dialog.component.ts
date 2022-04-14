import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICommercant } from '../commercant.model';
import { CommercantService } from '../service/commercant.service';

@Component({
  templateUrl: './commercant-delete-dialog.component.html',
})
export class CommercantDeleteDialogComponent {
  commercant?: ICommercant;

  constructor(protected commercantService: CommercantService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.commercantService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
