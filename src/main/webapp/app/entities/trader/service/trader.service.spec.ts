import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITrader, Trader } from '../trader.model';

import { TraderService } from './trader.service';

describe('Trader Service', () => {
  let service: TraderService;
  let httpMock: HttpTestingController;
  let elemDefault: ITrader;
  let expectedResult: ITrader | ITrader[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TraderService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      shopRating: 'AAAAAAA',
      isOpen: false,
      averageDeliveryTime: 0,
      openingTime: currentDate,
      closingTime: currentDate,
      tags: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          openingTime: currentDate.format(DATE_TIME_FORMAT),
          closingTime: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Trader', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          openingTime: currentDate.format(DATE_TIME_FORMAT),
          closingTime: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          openingTime: currentDate,
          closingTime: currentDate,
        },
        returnedFromService
      );

      service.create(new Trader()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Trader', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          shopRating: 'BBBBBB',
          isOpen: true,
          averageDeliveryTime: 1,
          openingTime: currentDate.format(DATE_TIME_FORMAT),
          closingTime: currentDate.format(DATE_TIME_FORMAT),
          tags: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          openingTime: currentDate,
          closingTime: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Trader', () => {
      const patchObject = Object.assign(
        {
          shopRating: 'BBBBBB',
          averageDeliveryTime: 1,
          closingTime: currentDate.format(DATE_TIME_FORMAT),
        },
        new Trader()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          openingTime: currentDate,
          closingTime: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Trader', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          shopRating: 'BBBBBB',
          isOpen: true,
          averageDeliveryTime: 1,
          openingTime: currentDate.format(DATE_TIME_FORMAT),
          closingTime: currentDate.format(DATE_TIME_FORMAT),
          tags: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          openingTime: currentDate,
          closingTime: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Trader', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTraderToCollectionIfMissing', () => {
      it('should add a Trader to an empty array', () => {
        const trader: ITrader = { id: 123 };
        expectedResult = service.addTraderToCollectionIfMissing([], trader);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(trader);
      });

      it('should not add a Trader to an array that contains it', () => {
        const trader: ITrader = { id: 123 };
        const traderCollection: ITrader[] = [
          {
            ...trader,
          },
          { id: 456 },
        ];
        expectedResult = service.addTraderToCollectionIfMissing(traderCollection, trader);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Trader to an array that doesn't contain it", () => {
        const trader: ITrader = { id: 123 };
        const traderCollection: ITrader[] = [{ id: 456 }];
        expectedResult = service.addTraderToCollectionIfMissing(traderCollection, trader);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(trader);
      });

      it('should add only unique Trader to an array', () => {
        const traderArray: ITrader[] = [{ id: 123 }, { id: 456 }, { id: 79580 }];
        const traderCollection: ITrader[] = [{ id: 123 }];
        expectedResult = service.addTraderToCollectionIfMissing(traderCollection, ...traderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const trader: ITrader = { id: 123 };
        const trader2: ITrader = { id: 456 };
        expectedResult = service.addTraderToCollectionIfMissing([], trader, trader2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(trader);
        expect(expectedResult).toContain(trader2);
      });

      it('should accept null and undefined values', () => {
        const trader: ITrader = { id: 123 };
        expectedResult = service.addTraderToCollectionIfMissing([], null, trader, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(trader);
      });

      it('should return initial array if no Trader is added', () => {
        const traderCollection: ITrader[] = [{ id: 123 }];
        expectedResult = service.addTraderToCollectionIfMissing(traderCollection, undefined, null);
        expect(expectedResult).toEqual(traderCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
