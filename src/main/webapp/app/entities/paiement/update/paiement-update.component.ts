import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPaiement, Paiement } from '../paiement.model';
import { PaiementService } from '../service/paiement.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { ICommercant } from 'app/entities/commercant/commercant.model';
import { CommercantService } from 'app/entities/commercant/service/commercant.service';

@Component({
  selector: 'jhi-paiement-update',
  templateUrl: './paiement-update.component.html',
})
export class PaiementUpdateComponent implements OnInit {
  isSaving = false;

  clientsSharedCollection: IClient[] = [];
  commercantsSharedCollection: ICommercant[] = [];

  editForm = this.fb.group({
    id: [],
    amount: [null, [Validators.required]],
    paiementType: [null, [Validators.required]],
    client: [],
    commercant: [],
  });

  constructor(
    protected paiementService: PaiementService,
    protected clientService: ClientService,
    protected commercantService: CommercantService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paiement }) => {
      this.updateForm(paiement);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paiement = this.createFromForm();
    if (paiement.id !== undefined) {
      this.subscribeToSaveResponse(this.paiementService.update(paiement));
    } else {
      this.subscribeToSaveResponse(this.paiementService.create(paiement));
    }
  }

  trackClientById(_index: number, item: IClient): number {
    return item.id!;
  }

  trackCommercantById(_index: number, item: ICommercant): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaiement>>): void {
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

  protected updateForm(paiement: IPaiement): void {
    this.editForm.patchValue({
      id: paiement.id,
      amount: paiement.amount,
      paiementType: paiement.paiementType,
      client: paiement.client,
      commercant: paiement.commercant,
    });

    this.clientsSharedCollection = this.clientService.addClientToCollectionIfMissing(this.clientsSharedCollection, paiement.client);
    this.commercantsSharedCollection = this.commercantService.addCommercantToCollectionIfMissing(
      this.commercantsSharedCollection,
      paiement.commercant
    );
  }

  protected loadRelationshipsOptions(): void {
    this.clientService
      .query()
      .pipe(map((res: HttpResponse<IClient[]>) => res.body ?? []))
      .pipe(map((clients: IClient[]) => this.clientService.addClientToCollectionIfMissing(clients, this.editForm.get('client')!.value)))
      .subscribe((clients: IClient[]) => (this.clientsSharedCollection = clients));

    this.commercantService
      .query()
      .pipe(map((res: HttpResponse<ICommercant[]>) => res.body ?? []))
      .pipe(
        map((commercants: ICommercant[]) =>
          this.commercantService.addCommercantToCollectionIfMissing(commercants, this.editForm.get('commercant')!.value)
        )
      )
      .subscribe((commercants: ICommercant[]) => (this.commercantsSharedCollection = commercants));
  }

  protected createFromForm(): IPaiement {
    return {
      ...new Paiement(),
      id: this.editForm.get(['id'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      paiementType: this.editForm.get(['paiementType'])!.value,
      client: this.editForm.get(['client'])!.value,
      commercant: this.editForm.get(['commercant'])!.value,
    };
  }
}
