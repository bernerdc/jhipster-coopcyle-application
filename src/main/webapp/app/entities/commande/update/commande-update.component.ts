import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICommande, Commande } from '../commande.model';
import { CommandeService } from '../service/commande.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { ILivreur } from 'app/entities/livreur/livreur.model';
import { LivreurService } from 'app/entities/livreur/service/livreur.service';
import { ICommercant } from 'app/entities/commercant/commercant.model';
import { CommercantService } from 'app/entities/commercant/service/commercant.service';

@Component({
  selector: 'jhi-commande-update',
  templateUrl: './commande-update.component.html',
})
export class CommandeUpdateComponent implements OnInit {
  isSaving = false;

  clientsSharedCollection: IClient[] = [];
  livreursSharedCollection: ILivreur[] = [];
  commercantsSharedCollection: ICommercant[] = [];

  editForm = this.fb.group({
    id: [],
    pickupAddress: [],
    deliveryAddress: [],
    client: [],
    livreur: [],
    commercant: [],
  });

  constructor(
    protected commandeService: CommandeService,
    protected clientService: ClientService,
    protected livreurService: LivreurService,
    protected commercantService: CommercantService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ commande }) => {
      this.updateForm(commande);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const commande = this.createFromForm();
    if (commande.id !== undefined) {
      this.subscribeToSaveResponse(this.commandeService.update(commande));
    } else {
      this.subscribeToSaveResponse(this.commandeService.create(commande));
    }
  }

  trackClientById(_index: number, item: IClient): number {
    return item.id!;
  }

  trackLivreurById(_index: number, item: ILivreur): number {
    return item.id!;
  }

  trackCommercantById(_index: number, item: ICommercant): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICommande>>): void {
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

  protected updateForm(commande: ICommande): void {
    this.editForm.patchValue({
      id: commande.id,
      pickupAddress: commande.pickupAddress,
      deliveryAddress: commande.deliveryAddress,
      client: commande.client,
      livreur: commande.livreur,
      commercant: commande.commercant,
    });

    this.clientsSharedCollection = this.clientService.addClientToCollectionIfMissing(this.clientsSharedCollection, commande.client);
    this.livreursSharedCollection = this.livreurService.addLivreurToCollectionIfMissing(this.livreursSharedCollection, commande.livreur);
    this.commercantsSharedCollection = this.commercantService.addCommercantToCollectionIfMissing(
      this.commercantsSharedCollection,
      commande.commercant
    );
  }

  protected loadRelationshipsOptions(): void {
    this.clientService
      .query()
      .pipe(map((res: HttpResponse<IClient[]>) => res.body ?? []))
      .pipe(map((clients: IClient[]) => this.clientService.addClientToCollectionIfMissing(clients, this.editForm.get('client')!.value)))
      .subscribe((clients: IClient[]) => (this.clientsSharedCollection = clients));

    this.livreurService
      .query()
      .pipe(map((res: HttpResponse<ILivreur[]>) => res.body ?? []))
      .pipe(
        map((livreurs: ILivreur[]) => this.livreurService.addLivreurToCollectionIfMissing(livreurs, this.editForm.get('livreur')!.value))
      )
      .subscribe((livreurs: ILivreur[]) => (this.livreursSharedCollection = livreurs));

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

  protected createFromForm(): ICommande {
    return {
      ...new Commande(),
      id: this.editForm.get(['id'])!.value,
      pickupAddress: this.editForm.get(['pickupAddress'])!.value,
      deliveryAddress: this.editForm.get(['deliveryAddress'])!.value,
      client: this.editForm.get(['client'])!.value,
      livreur: this.editForm.get(['livreur'])!.value,
      commercant: this.editForm.get(['commercant'])!.value,
    };
  }
}
