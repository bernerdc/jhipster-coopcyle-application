import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILivreur, Livreur } from '../livreur.model';
import { LivreurService } from '../service/livreur.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-livreur-update',
  templateUrl: './livreur-update.component.html',
})
export class LivreurUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    vehicleType: [],
    totalEarnings: [],
    totalRides: [],
    transporterRating: [],
    user: [],
  });

  constructor(
    protected livreurService: LivreurService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ livreur }) => {
      this.updateForm(livreur);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const livreur = this.createFromForm();
    if (livreur.id !== undefined) {
      this.subscribeToSaveResponse(this.livreurService.update(livreur));
    } else {
      this.subscribeToSaveResponse(this.livreurService.create(livreur));
    }
  }

  trackUserById(_index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILivreur>>): void {
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

  protected updateForm(livreur: ILivreur): void {
    this.editForm.patchValue({
      id: livreur.id,
      vehicleType: livreur.vehicleType,
      totalEarnings: livreur.totalEarnings,
      totalRides: livreur.totalRides,
      transporterRating: livreur.transporterRating,
      user: livreur.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, livreur.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): ILivreur {
    return {
      ...new Livreur(),
      id: this.editForm.get(['id'])!.value,
      vehicleType: this.editForm.get(['vehicleType'])!.value,
      totalEarnings: this.editForm.get(['totalEarnings'])!.value,
      totalRides: this.editForm.get(['totalRides'])!.value,
      transporterRating: this.editForm.get(['transporterRating'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
