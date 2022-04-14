import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPayment, Payment } from '../payment.model';
import { PaymentService } from '../service/payment.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { ITrader } from 'app/entities/trader/trader.model';
import { TraderService } from 'app/entities/trader/service/trader.service';

@Component({
  selector: 'jhi-payment-update',
  templateUrl: './payment-update.component.html',
})
export class PaymentUpdateComponent implements OnInit {
  isSaving = false;

  clientsSharedCollection: IClient[] = [];
  tradersSharedCollection: ITrader[] = [];

  editForm = this.fb.group({
    id: [],
    amount: [null, [Validators.required]],
    paiementType: [null, [Validators.required]],
    client: [],
    trader: [],
  });

  constructor(
    protected paymentService: PaymentService,
    protected clientService: ClientService,
    protected traderService: TraderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payment }) => {
      this.updateForm(payment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const payment = this.createFromForm();
    if (payment.id !== undefined) {
      this.subscribeToSaveResponse(this.paymentService.update(payment));
    } else {
      this.subscribeToSaveResponse(this.paymentService.create(payment));
    }
  }

  trackClientById(_index: number, item: IClient): number {
    return item.id!;
  }

  trackTraderById(_index: number, item: ITrader): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPayment>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(payment: IPayment): void {
    this.editForm.patchValue({
      id: payment.id,
      amount: payment.amount,
      paiementType: payment.paiementType,
      client: payment.client,
      trader: payment.trader,
    });

    this.clientsSharedCollection = this.clientService.addClientToCollectionIfMissing(this.clientsSharedCollection, payment.client);
    this.tradersSharedCollection = this.traderService.addTraderToCollectionIfMissing(this.tradersSharedCollection, payment.trader);
  }

  protected loadRelationshipsOptions(): void {
    this.clientService
      .query()
      .pipe(map((res: HttpResponse<IClient[]>) => res.body ?? []))
      .pipe(map((clients: IClient[]) => this.clientService.addClientToCollectionIfMissing(clients, this.editForm.get('client')!.value)))
      .subscribe((clients: IClient[]) => (this.clientsSharedCollection = clients));

    this.traderService
      .query()
      .pipe(map((res: HttpResponse<ITrader[]>) => res.body ?? []))
      .pipe(map((traders: ITrader[]) => this.traderService.addTraderToCollectionIfMissing(traders, this.editForm.get('trader')!.value)))
      .subscribe((traders: ITrader[]) => (this.tradersSharedCollection = traders));
  }

  protected createFromForm(): IPayment {
    return {
      ...new Payment(),
      id: this.editForm.get(['id'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      paiementType: this.editForm.get(['paiementType'])!.value,
      client: this.editForm.get(['client'])!.value,
      trader: this.editForm.get(['trader'])!.value,
    };
  }
}
