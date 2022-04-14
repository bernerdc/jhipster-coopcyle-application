import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITrader } from '../trader.model';
import { TraderService } from '../service/trader.service';
import { TraderDeleteDialogComponent } from '../delete/trader-delete-dialog.component';

@Component({
  selector: 'jhi-trader',
  templateUrl: './trader.component.html',
})
export class TraderComponent implements OnInit {
  traders?: ITrader[];
  isLoading = false;

  constructor(protected traderService: TraderService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.traderService.query().subscribe({
      next: (res: HttpResponse<ITrader[]>) => {
        this.isLoading = false;
        this.traders = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ITrader): number {
    return item.id!;
  }

  delete(trader: ITrader): void {
    const modalRef = this.modalService.open(TraderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.trader = trader;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
