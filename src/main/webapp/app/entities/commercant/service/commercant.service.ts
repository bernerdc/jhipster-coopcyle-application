import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICommercant, getCommercantIdentifier } from '../commercant.model';

export type EntityResponseType = HttpResponse<ICommercant>;
export type EntityArrayResponseType = HttpResponse<ICommercant[]>;

@Injectable({ providedIn: 'root' })
export class CommercantService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/commercants');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(commercant: ICommercant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(commercant);
    return this.http
      .post<ICommercant>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(commercant: ICommercant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(commercant);
    return this.http
      .put<ICommercant>(`${this.resourceUrl}/${getCommercantIdentifier(commercant) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(commercant: ICommercant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(commercant);
    return this.http
      .patch<ICommercant>(`${this.resourceUrl}/${getCommercantIdentifier(commercant) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICommercant>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICommercant[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCommercantToCollectionIfMissing(
    commercantCollection: ICommercant[],
    ...commercantsToCheck: (ICommercant | null | undefined)[]
  ): ICommercant[] {
    const commercants: ICommercant[] = commercantsToCheck.filter(isPresent);
    if (commercants.length > 0) {
      const commercantCollectionIdentifiers = commercantCollection.map(commercantItem => getCommercantIdentifier(commercantItem)!);
      const commercantsToAdd = commercants.filter(commercantItem => {
        const commercantIdentifier = getCommercantIdentifier(commercantItem);
        if (commercantIdentifier == null || commercantCollectionIdentifiers.includes(commercantIdentifier)) {
          return false;
        }
        commercantCollectionIdentifiers.push(commercantIdentifier);
        return true;
      });
      return [...commercantsToAdd, ...commercantCollection];
    }
    return commercantCollection;
  }

  protected convertDateFromClient(commercant: ICommercant): ICommercant {
    return Object.assign({}, commercant, {
      openingTime: commercant.openingTime?.isValid() ? commercant.openingTime.toJSON() : undefined,
      closingTime: commercant.closingTime?.isValid() ? commercant.closingTime.toJSON() : undefined,
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
      res.body.forEach((commercant: ICommercant) => {
        commercant.openingTime = commercant.openingTime ? dayjs(commercant.openingTime) : undefined;
        commercant.closingTime = commercant.closingTime ? dayjs(commercant.closingTime) : undefined;
      });
    }
    return res;
  }
}
