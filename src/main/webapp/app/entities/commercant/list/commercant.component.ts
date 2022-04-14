import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICommercant } from '../commercant.model';
import { CommercantService } from '../service/commercant.service';
import { CommercantDeleteDialogComponent } from '../delete/commercant-delete-dialog.component';

@Component({
  selector: 'jhi-commercant',
  templateUrl: './commercant.component.html',
})
export class CommercantComponent implements OnInit {
  commercants?: ICommercant[];
  isLoading = false;

  constructor(protected commercantService: CommercantService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.commercantService.query().subscribe({
      next: (res: HttpResponse<ICommercant[]>) => {
        this.isLoading = false;
        this.commercants = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ICommercant): number {
    return item.id!;
  }

  delete(commercant: ICommercant): void {
    const modalRef = this.modalService.open(CommercantDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.commercant = commercant;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
