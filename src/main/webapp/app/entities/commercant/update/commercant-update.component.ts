import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ICommercant, Commercant } from '../commercant.model';
import { CommercantService } from '../service/commercant.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICooperative } from 'app/entities/cooperative/cooperative.model';
import { CooperativeService } from 'app/entities/cooperative/service/cooperative.service';

@Component({
  selector: 'jhi-commercant-update',
  templateUrl: './commercant-update.component.html',
})
export class CommercantUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  cooperativesSharedCollection: ICooperative[] = [];

  editForm = this.fb.group({
    id: [],
    shopRating: [],
    isOpen: [],
    averageDeliveryTime: [],
    openingTime: [],
    closingTime: [],
    tags: [],
    user: [],
    cooperative: [],
  });

  constructor(
    protected commercantService: CommercantService,
    protected userService: UserService,
    protected cooperativeService: CooperativeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ commercant }) => {
      if (commercant.id === undefined) {
        const today = dayjs().startOf('day');
        commercant.openingTime = today;
        commercant.closingTime = today;
      }

      this.updateForm(commercant);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const commercant = this.createFromForm();
    if (commercant.id !== undefined) {
      this.subscribeToSaveResponse(this.commercantService.update(commercant));
    } else {
      this.subscribeToSaveResponse(this.commercantService.create(commercant));
    }
  }

  trackUserById(_index: number, item: IUser): number {
    return item.id!;
  }

  trackCooperativeById(_index: number, item: ICooperative): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICommercant>>): void {
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

  protected updateForm(commercant: ICommercant): void {
    this.editForm.patchValue({
      id: commercant.id,
      shopRating: commercant.shopRating,
      isOpen: commercant.isOpen,
      averageDeliveryTime: commercant.averageDeliveryTime,
      openingTime: commercant.openingTime ? commercant.openingTime.format(DATE_TIME_FORMAT) : null,
      closingTime: commercant.closingTime ? commercant.closingTime.format(DATE_TIME_FORMAT) : null,
      tags: commercant.tags,
      user: commercant.user,
      cooperative: commercant.cooperative,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, commercant.user);
    this.cooperativesSharedCollection = this.cooperativeService.addCooperativeToCollectionIfMissing(
      this.cooperativesSharedCollection,
      commercant.cooperative
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.cooperativeService
      .query()
      .pipe(map((res: HttpResponse<ICooperative[]>) => res.body ?? []))
      .pipe(
        map((cooperatives: ICooperative[]) =>
          this.cooperativeService.addCooperativeToCollectionIfMissing(cooperatives, this.editForm.get('cooperative')!.value)
        )
      )
      .subscribe((cooperatives: ICooperative[]) => (this.cooperativesSharedCollection = cooperatives));
  }

  protected createFromForm(): ICommercant {
    return {
      ...new Commercant(),
      id: this.editForm.get(['id'])!.value,
      shopRating: this.editForm.get(['shopRating'])!.value,
      isOpen: this.editForm.get(['isOpen'])!.value,
      averageDeliveryTime: this.editForm.get(['averageDeliveryTime'])!.value,
      openingTime: this.editForm.get(['openingTime'])!.value
        ? dayjs(this.editForm.get(['openingTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      closingTime: this.editForm.get(['closingTime'])!.value
        ? dayjs(this.editForm.get(['closingTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      tags: this.editForm.get(['tags'])!.value,
      user: this.editForm.get(['user'])!.value,
      cooperative: this.editForm.get(['cooperative'])!.value,
    };
  }
}
