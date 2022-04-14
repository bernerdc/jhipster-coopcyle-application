import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CommercantComponent } from '../list/commercant.component';
import { CommercantDetailComponent } from '../detail/commercant-detail.component';
import { CommercantUpdateComponent } from '../update/commercant-update.component';
import { CommercantRoutingResolveService } from './commercant-routing-resolve.service';

const commercantRoute: Routes = [
  {
    path: '',
    component: CommercantComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CommercantDetailComponent,
    resolve: {
      commercant: CommercantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CommercantUpdateComponent,
    resolve: {
      commercant: CommercantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CommercantUpdateComponent,
    resolve: {
      commercant: CommercantRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(commercantRoute)],
  exports: [RouterModule],
})
export class CommercantRoutingModule {}
