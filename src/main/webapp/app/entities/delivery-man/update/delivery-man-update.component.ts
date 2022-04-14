import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDeliveryMan, DeliveryMan } from '../delivery-man.model';
import { DeliveryManService } from '../service/delivery-man.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-delivery-man-update',
  templateUrl: './delivery-man-update.component.html',
})
export class DeliveryManUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    vehicle: [],
    numberOfEarnings: [],
    numberOfRides: [],
    rating: [],
    user: [],
  });

  constructor(
    protected deliveryManService: DeliveryManService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ deliveryMan }) => {
      this.updateForm(deliveryMan);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const deliveryMan = this.createFromForm();
    if (deliveryMan.id !== undefined) {
      this.subscribeToSaveResponse(this.deliveryManService.update(deliveryMan));
    } else {
      this.subscribeToSaveResponse(this.deliveryManService.create(deliveryMan));
    }
  }

  trackUserById(_index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDeliveryMan>>): void {
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

  protected updateForm(deliveryMan: IDeliveryMan): void {
    this.editForm.patchValue({
      id: deliveryMan.id,
      vehicle: deliveryMan.vehicle,
      numberOfEarnings: deliveryMan.numberOfEarnings,
      numberOfRides: deliveryMan.numberOfRides,
      rating: deliveryMan.rating,
      user: deliveryMan.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, deliveryMan.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IDeliveryMan {
    return {
      ...new DeliveryMan(),
      id: this.editForm.get(['id'])!.value,
      vehicle: this.editForm.get(['vehicle'])!.value,
      numberOfEarnings: this.editForm.get(['numberOfEarnings'])!.value,
      numberOfRides: this.editForm.get(['numberOfRides'])!.value,
      rating: this.editForm.get(['rating'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
