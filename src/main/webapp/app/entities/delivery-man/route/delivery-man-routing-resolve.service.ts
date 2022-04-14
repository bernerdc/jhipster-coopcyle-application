import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDeliveryMan, DeliveryMan } from '../delivery-man.model';
import { DeliveryManService } from '../service/delivery-man.service';

@Injectable({ providedIn: 'root' })
export class DeliveryManRoutingResolveService implements Resolve<IDeliveryMan> {
  constructor(protected service: DeliveryManService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDeliveryMan> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((deliveryMan: HttpResponse<DeliveryMan>) => {
          if (deliveryMan.body) {
            return of(deliveryMan.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DeliveryMan());
  }
}
