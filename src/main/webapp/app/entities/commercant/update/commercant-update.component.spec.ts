import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CommercantService } from '../service/commercant.service';
import { ICommercant, Commercant } from '../commercant.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICooperative } from 'app/entities/cooperative/cooperative.model';
import { CooperativeService } from 'app/entities/cooperative/service/cooperative.service';

import { CommercantUpdateComponent } from './commercant-update.component';

describe('Commercant Management Update Component', () => {
  let comp: CommercantUpdateComponent;
  let fixture: ComponentFixture<CommercantUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let commercantService: CommercantService;
  let userService: UserService;
  let cooperativeService: CooperativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CommercantUpdateComponent],
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
      .overrideTemplate(CommercantUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommercantUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    commercantService = TestBed.inject(CommercantService);
    userService = TestBed.inject(UserService);
    cooperativeService = TestBed.inject(CooperativeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const commercant: ICommercant = { id: 456 };
      const user: IUser = { id: 93649 };
      commercant.user = user;

      const userCollection: IUser[] = [{ id: 16122 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ commercant });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Cooperative query and add missing value', () => {
      const commercant: ICommercant = { id: 456 };
      const cooperative: ICooperative = { id: 23574 };
      commercant.cooperative = cooperative;

      const cooperativeCollection: ICooperative[] = [{ id: 88900 }];
      jest.spyOn(cooperativeService, 'query').mockReturnValue(of(new HttpResponse({ body: cooperativeCollection })));
      const additionalCooperatives = [cooperative];
      const expectedCollection: ICooperative[] = [...additionalCooperatives, ...cooperativeCollection];
      jest.spyOn(cooperativeService, 'addCooperativeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ commercant });
      comp.ngOnInit();

      expect(cooperativeService.query).toHaveBeenCalled();
      expect(cooperativeService.addCooperativeToCollectionIfMissing).toHaveBeenCalledWith(cooperativeCollection, ...additionalCooperatives);
      expect(comp.cooperativesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const commercant: ICommercant = { id: 456 };
      const user: IUser = { id: 60311 };
      commercant.user = user;
      const cooperative: ICooperative = { id: 62864 };
      commercant.cooperative = cooperative;

      activatedRoute.data = of({ commercant });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(commercant));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.cooperativesSharedCollection).toContain(cooperative);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Commercant>>();
      const commercant = { id: 123 };
      jest.spyOn(commercantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ commercant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: commercant }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(commercantService.update).toHaveBeenCalledWith(commercant);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Commercant>>();
      const commercant = new Commercant();
      jest.spyOn(commercantService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ commercant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: commercant }));
      saveSubject.complete();

      // THEN
      expect(commercantService.create).toHaveBeenCalledWith(commercant);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Commercant>>();
      const commercant = { id: 123 };
      jest.spyOn(commercantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ commercant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(commercantService.update).toHaveBeenCalledWith(commercant);
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
