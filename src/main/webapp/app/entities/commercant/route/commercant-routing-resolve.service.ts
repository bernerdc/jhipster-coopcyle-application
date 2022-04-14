import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICommercant, Commercant } from '../commercant.model';
import { CommercantService } from '../service/commercant.service';

@Injectable({ providedIn: 'root' })
export class CommercantRoutingResolveService implements Resolve<ICommercant> {
  constructor(protected service: CommercantService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICommercant> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((commercant: HttpResponse<Commercant>) => {
          if (commercant.body) {
            return of(commercant.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Commercant());
  }
}
