import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DeliveryManComponent } from '../list/delivery-man.component';
import { DeliveryManDetailComponent } from '../detail/delivery-man-detail.component';
import { DeliveryManUpdateComponent } from '../update/delivery-man-update.component';
import { DeliveryManRoutingResolveService } from './delivery-man-routing-resolve.service';

const deliveryManRoute: Routes = [
  {
    path: '',
    component: DeliveryManComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DeliveryManDetailComponent,
    resolve: {
      deliveryMan: DeliveryManRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DeliveryManUpdateComponent,
    resolve: {
      deliveryMan: DeliveryManRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DeliveryManUpdateComponent,
    resolve: {
      deliveryMan: DeliveryManRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(deliveryManRoute)],
  exports: [RouterModule],
})
export class DeliveryManRoutingModule {}
