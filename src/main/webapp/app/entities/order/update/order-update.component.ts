import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOrder, Order } from '../order.model';
import { OrderService } from '../service/order.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { IDeliveryMan } from 'app/entities/delivery-man/delivery-man.model';
import { DeliveryManService } from 'app/entities/delivery-man/service/delivery-man.service';
import { ITrader } from 'app/entities/trader/trader.model';
import { TraderService } from 'app/entities/trader/service/trader.service';

@Component({
  selector: 'jhi-order-update',
  templateUrl: './order-update.component.html',
})
export class OrderUpdateComponent implements OnInit {
  isSaving = false;

  clientsSharedCollection: IClient[] = [];
  deliveryMenSharedCollection: IDeliveryMan[] = [];
  tradersSharedCollection: ITrader[] = [];

  editForm = this.fb.group({
    id: [],
    pickupAddr: [],
    deliveryAddr: [],
    client: [],
    deliveryMan: [],
    trader: [],
  });

  constructor(
    protected orderService: OrderService,
    protected clientService: ClientService,
    protected deliveryManService: DeliveryManService,
    protected traderService: TraderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      this.updateForm(order);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const order = this.createFromForm();
    if (order.id !== undefined) {
      this.subscribeToSaveResponse(this.orderService.update(order));
    } else {
      this.subscribeToSaveResponse(this.orderService.create(order));
    }
  }

  trackClientById(_index: number, item: IClient): number {
    return item.id!;
  }

  trackDeliveryManById(_index: number, item: IDeliveryMan): number {
    return item.id!;
  }

  trackTraderById(_index: number, item: ITrader): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
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

  protected updateForm(order: IOrder): void {
    this.editForm.patchValue({
      id: order.id,
      pickupAddr: order.pickupAddr,
      deliveryAddr: order.deliveryAddr,
      client: order.client,
      deliveryMan: order.deliveryMan,
      trader: order.trader,
    });

    this.clientsSharedCollection = this.clientService.addClientToCollectionIfMissing(this.clientsSharedCollection, order.client);
    this.deliveryMenSharedCollection = this.deliveryManService.addDeliveryManToCollectionIfMissing(
      this.deliveryMenSharedCollection,
      order.deliveryMan
    );
    this.tradersSharedCollection = this.traderService.addTraderToCollectionIfMissing(this.tradersSharedCollection, order.trader);
  }

  protected loadRelationshipsOptions(): void {
    this.clientService
      .query()
      .pipe(map((res: HttpResponse<IClient[]>) => res.body ?? []))
      .pipe(map((clients: IClient[]) => this.clientService.addClientToCollectionIfMissing(clients, this.editForm.get('client')!.value)))
      .subscribe((clients: IClient[]) => (this.clientsSharedCollection = clients));

    this.deliveryManService
      .query()
      .pipe(map((res: HttpResponse<IDeliveryMan[]>) => res.body ?? []))
      .pipe(
        map((deliveryMen: IDeliveryMan[]) =>
          this.deliveryManService.addDeliveryManToCollectionIfMissing(deliveryMen, this.editForm.get('deliveryMan')!.value)
        )
      )
      .subscribe((deliveryMen: IDeliveryMan[]) => (this.deliveryMenSharedCollection = deliveryMen));

    this.traderService
      .query()
      .pipe(map((res: HttpResponse<ITrader[]>) => res.body ?? []))
      .pipe(map((traders: ITrader[]) => this.traderService.addTraderToCollectionIfMissing(traders, this.editForm.get('trader')!.value)))
      .subscribe((traders: ITrader[]) => (this.tradersSharedCollection = traders));
  }

  protected createFromForm(): IOrder {
    return {
      ...new Order(),
      id: this.editForm.get(['id'])!.value,
      pickupAddr: this.editForm.get(['pickupAddr'])!.value,
      deliveryAddr: this.editForm.get(['deliveryAddr'])!.value,
      client: this.editForm.get(['client'])!.value,
      deliveryMan: this.editForm.get(['deliveryMan'])!.value,
      trader: this.editForm.get(['trader'])!.value,
    };
  }
}
