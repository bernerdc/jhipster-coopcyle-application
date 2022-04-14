import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILivreur, Livreur } from '../livreur.model';

import { LivreurService } from './livreur.service';

describe('Livreur Service', () => {
  let service: LivreurService;
  let httpMock: HttpTestingController;
  let elemDefault: ILivreur;
  let expectedResult: ILivreur | ILivreur[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LivreurService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      vehicleType: 'AAAAAAA',
      totalEarnings: 0,
      totalRides: 0,
      transporterRating: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Livreur', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Livreur()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Livreur', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          vehicleType: 'BBBBBB',
          totalEarnings: 1,
          totalRides: 1,
          transporterRating: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Livreur', () => {
      const patchObject = Object.assign(
        {
          vehicleType: 'BBBBBB',
          totalRides: 1,
          transporterRating: 'BBBBBB',
        },
        new Livreur()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Livreur', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          vehicleType: 'BBBBBB',
          totalEarnings: 1,
          totalRides: 1,
          transporterRating: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Livreur', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLivreurToCollectionIfMissing', () => {
      it('should add a Livreur to an empty array', () => {
        const livreur: ILivreur = { id: 123 };
        expectedResult = service.addLivreurToCollectionIfMissing([], livreur);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(livreur);
      });

      it('should not add a Livreur to an array that contains it', () => {
        const livreur: ILivreur = { id: 123 };
        const livreurCollection: ILivreur[] = [
          {
            ...livreur,
          },
          { id: 456 },
        ];
        expectedResult = service.addLivreurToCollectionIfMissing(livreurCollection, livreur);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Livreur to an array that doesn't contain it", () => {
        const livreur: ILivreur = { id: 123 };
        const livreurCollection: ILivreur[] = [{ id: 456 }];
        expectedResult = service.addLivreurToCollectionIfMissing(livreurCollection, livreur);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(livreur);
      });

      it('should add only unique Livreur to an array', () => {
        const livreurArray: ILivreur[] = [{ id: 123 }, { id: 456 }, { id: 3467 }];
        const livreurCollection: ILivreur[] = [{ id: 123 }];
        expectedResult = service.addLivreurToCollectionIfMissing(livreurCollection, ...livreurArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const livreur: ILivreur = { id: 123 };
        const livreur2: ILivreur = { id: 456 };
        expectedResult = service.addLivreurToCollectionIfMissing([], livreur, livreur2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(livreur);
        expect(expectedResult).toContain(livreur2);
      });

      it('should accept null and undefined values', () => {
        const livreur: ILivreur = { id: 123 };
        expectedResult = service.addLivreurToCollectionIfMissing([], null, livreur, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(livreur);
      });

      it('should return initial array if no Livreur is added', () => {
        const livreurCollection: ILivreur[] = [{ id: 123 }];
        expectedResult = service.addLivreurToCollectionIfMissing(livreurCollection, undefined, null);
        expect(expectedResult).toEqual(livreurCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
