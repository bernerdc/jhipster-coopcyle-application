import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITrader, Trader } from '../trader.model';
import { TraderService } from '../service/trader.service';

@Injectable({ providedIn: 'root' })
export class TraderRoutingResolveService implements Resolve<ITrader> {
  constructor(protected service: TraderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITrader> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((trader: HttpResponse<Trader>) => {
          if (trader.body) {
            return of(trader.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Trader());
  }
}
