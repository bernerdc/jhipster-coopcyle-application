import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITrader, getTraderIdentifier } from '../trader.model';

export type EntityResponseType = HttpResponse<ITrader>;
export type EntityArrayResponseType = HttpResponse<ITrader[]>;

@Injectable({ providedIn: 'root' })
export class TraderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/traders');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(trader: ITrader): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(trader);
    return this.http
      .post<ITrader>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(trader: ITrader): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(trader);
    return this.http
      .put<ITrader>(`${this.resourceUrl}/${getTraderIdentifier(trader) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(trader: ITrader): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(trader);
    return this.http
      .patch<ITrader>(`${this.resourceUrl}/${getTraderIdentifier(trader) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITrader>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITrader[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTraderToCollectionIfMissing(traderCollection: ITrader[], ...tradersToCheck: (ITrader | null | undefined)[]): ITrader[] {
    const traders: ITrader[] = tradersToCheck.filter(isPresent);
    if (traders.length > 0) {
      const traderCollectionIdentifiers = traderCollection.map(traderItem => getTraderIdentifier(traderItem)!);
      const tradersToAdd = traders.filter(traderItem => {
        const traderIdentifier = getTraderIdentifier(traderItem);
        if (traderIdentifier == null || traderCollectionIdentifiers.includes(traderIdentifier)) {
          return false;
        }
        traderCollectionIdentifiers.push(traderIdentifier);
        return true;
      });
      return [...tradersToAdd, ...traderCollection];
    }
    return traderCollection;
  }

  protected convertDateFromClient(trader: ITrader): ITrader {
    return Object.assign({}, trader, {
      openingTime: trader.openingTime?.isValid() ? trader.openingTime.toJSON() : undefined,
      closingTime: trader.closingTime?.isValid() ? trader.closingTime.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.openingTime = res.body.openingTime ? dayjs(res.body.openingTime) : undefined;
      res.body.closingTime = res.body.closingTime ? dayjs(res.body.closingTime) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((trader: ITrader) => {
        trader.openingTime = trader.openingTime ? dayjs(trader.openingTime) : undefined;
        trader.closingTime = trader.closingTime ? dayjs(trader.closingTime) : undefined;
      });
    }
    return res;
  }
}
