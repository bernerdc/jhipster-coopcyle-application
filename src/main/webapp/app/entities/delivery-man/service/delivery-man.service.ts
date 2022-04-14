import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDeliveryMan, getDeliveryManIdentifier } from '../delivery-man.model';

export type EntityResponseType = HttpResponse<IDeliveryMan>;
export type EntityArrayResponseType = HttpResponse<IDeliveryMan[]>;

@Injectable({ providedIn: 'root' })
export class DeliveryManService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/delivery-men');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(deliveryMan: IDeliveryMan): Observable<EntityResponseType> {
    return this.http.post<IDeliveryMan>(this.resourceUrl, deliveryMan, { observe: 'response' });
  }

  update(deliveryMan: IDeliveryMan): Observable<EntityResponseType> {
    return this.http.put<IDeliveryMan>(`${this.resourceUrl}/${getDeliveryManIdentifier(deliveryMan) as number}`, deliveryMan, {
      observe: 'response',
    });
  }

  partialUpdate(deliveryMan: IDeliveryMan): Observable<EntityResponseType> {
    return this.http.patch<IDeliveryMan>(`${this.resourceUrl}/${getDeliveryManIdentifier(deliveryMan) as number}`, deliveryMan, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDeliveryMan>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDeliveryMan[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDeliveryManToCollectionIfMissing(
    deliveryManCollection: IDeliveryMan[],
    ...deliveryMenToCheck: (IDeliveryMan | null | undefined)[]
  ): IDeliveryMan[] {
    const deliveryMen: IDeliveryMan[] = deliveryMenToCheck.filter(isPresent);
    if (deliveryMen.length > 0) {
      const deliveryManCollectionIdentifiers = deliveryManCollection.map(deliveryManItem => getDeliveryManIdentifier(deliveryManItem)!);
      const deliveryMenToAdd = deliveryMen.filter(deliveryManItem => {
        const deliveryManIdentifier = getDeliveryManIdentifier(deliveryManItem);
        if (deliveryManIdentifier == null || deliveryManCollectionIdentifiers.includes(deliveryManIdentifier)) {
          return false;
        }
        deliveryManCollectionIdentifiers.push(deliveryManIdentifier);
        return true;
      });
      return [...deliveryMenToAdd, ...deliveryManCollection];
    }
    return deliveryManCollection;
  }
}
