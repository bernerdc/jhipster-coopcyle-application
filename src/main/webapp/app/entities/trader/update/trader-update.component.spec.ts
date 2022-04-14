import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TraderService } from '../service/trader.service';
import { ITrader, Trader } from '../trader.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICooperative } from 'app/entities/cooperative/cooperative.model';
import { CooperativeService } from 'app/entities/cooperative/service/cooperative.service';

import { TraderUpdateComponent } from './trader-update.component';

describe('Trader Management Update Component', () => {
  let comp: TraderUpdateComponent;
  let fixture: ComponentFixture<TraderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let traderService: TraderService;
  let userService: UserService;
  let cooperativeService: CooperativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TraderUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TraderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TraderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    traderService = TestBed.inject(TraderService);
    userService = TestBed.inject(UserService);
    cooperativeService = TestBed.inject(CooperativeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const trader: ITrader = { id: 456 };
      const user: IUser = { id: 12963 };
      trader.user = user;

      const userCollection: IUser[] = [{ id: 36428 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ trader });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Cooperative query and add missing value', () => {
      const trader: ITrader = { id: 456 };
      const cooperative: ICooperative = { id: 7684 };
      trader.cooperative = cooperative;

      const cooperativeCollection: ICooperative[] = [{ id: 29286 }];
      jest.spyOn(cooperativeService, 'query').mockReturnValue(of(new HttpResponse({ body: cooperativeCollection })));
      const additionalCooperatives = [cooperative];
      const expectedCollection: ICooperative[] = [...additionalCooperatives, ...cooperativeCollection];
      jest.spyOn(cooperativeService, 'addCooperativeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ trader });
      comp.ngOnInit();

      expect(cooperativeService.query).toHaveBeenCalled();
      expect(cooperativeService.addCooperativeToCollectionIfMissing).toHaveBeenCalledWith(cooperativeCollection, ...additionalCooperatives);
      expect(comp.cooperativesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const trader: ITrader = { id: 456 };
      const user: IUser = { id: 92842 };
      trader.user = user;
      const cooperative: ICooperative = { id: 42750 };
      trader.cooperative = cooperative;

      activatedRoute.data = of({ trader });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(trader));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.cooperativesSharedCollection).toContain(cooperative);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Trader>>();
      const trader = { id: 123 };
      jest.spyOn(traderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ trader });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: trader }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(traderService.update).toHaveBeenCalledWith(trader);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Trader>>();
      const trader = new Trader();
      jest.spyOn(traderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ trader });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: trader }));
      saveSubject.complete();

      // THEN
      expect(traderService.create).toHaveBeenCalledWith(trader);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Trader>>();
      const trader = { id: 123 };
      jest.spyOn(traderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ trader });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(traderService.update).toHaveBeenCalledWith(trader);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCooperativeById', () => {
      it('Should return tracked Cooperative primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCooperativeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
