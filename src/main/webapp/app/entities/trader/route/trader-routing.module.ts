import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TraderComponent } from '../list/trader.component';
import { TraderDetailComponent } from '../detail/trader-detail.component';
import { TraderUpdateComponent } from '../update/trader-update.component';
import { TraderRoutingResolveService } from './trader-routing-resolve.service';

const traderRoute: Routes = [
  {
    path: '',
    component: TraderComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TraderDetailComponent,
    resolve: {
      trader: TraderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TraderUpdateComponent,
    resolve: {
      trader: TraderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TraderUpdateComponent,
    resolve: {
      trader: TraderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(traderRoute)],
  exports: [RouterModule],
})
export class TraderRoutingModule {}
