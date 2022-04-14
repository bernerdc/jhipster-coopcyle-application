import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PaiementService } from '../service/paiement.service';
import { IPaiement, Paiement } from '../paiement.model';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { ICommercant } from 'app/entities/commercant/commercant.model';
import { CommercantService } from 'app/entities/commercant/service/commercant.service';

import { PaiementUpdateComponent } from './paiement-update.component';

describe('Paiement Management Update Component', () => {
  let comp: PaiementUpdateComponent;
  let fixture: ComponentFixture<PaiementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paiementService: PaiementService;
  let clientService: ClientService;
  let commercantService: CommercantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PaiementUpdateComponent],
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
      .overrideTemplate(PaiementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PaiementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paiementService = TestBed.inject(PaiementService);
    clientService = TestBed.inject(ClientService);
    commercantService = TestBed.inject(CommercantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Client query and add missing value', () => {
      const paiement: IPaiement = { id: 456 };
      const client: IClient = { id: 25962 };
      paiement.client = client;

      const clientCollection: IClient[] = [{ id: 83882 }];
      jest.spyOn(clientService, 'query').mockReturnValue(of(new HttpResponse({ body: clientCollection })));
      const additionalClients = [client];
      const expectedCollection: IClient[] = [...additionalClients, ...clientCollection];
      jest.spyOn(clientService, 'addClientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paiement });
      comp.ngOnInit();

      expect(clientService.query).toHaveBeenCalled();
      expect(clientService.addClientToCollectionIfMissing).toHaveBeenCalledWith(clientCollection, ...additionalClients);
      expect(comp.clientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Commercant query and add missing value', () => {
      const paiement: IPaiement = { id: 456 };
      const commercant: ICommercant = { id: 18919 };
      paiement.commercant = commercant;

      const commercantCollection: ICommercant[] = [{ id: 62818 }];
      jest.spyOn(commercantService, 'query').mockReturnValue(of(new HttpResponse({ body: commercantCollection })));
      const additionalCommercants = [commercant];
      const expectedCollection: ICommercant[] = [...additionalCommercants, ...commercantCollection];
      jest.spyOn(commercantService, 'addCommercantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paiement });
      comp.ngOnInit();

      expect(commercantService.query).toHaveBeenCalled();
      expect(commercantService.addCommercantToCollectionIfMissing).toHaveBeenCalledWith(commercantCollection, ...additionalCommercants);
      expect(comp.commercantsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const paiement: IPaiement = { id: 456 };
      const client: IClient = { id: 96279 };
      paiement.client = client;
      const commercant: ICommercant = { id: 56229 };
      paiement.commercant = commercant;

      activatedRoute.data = of({ paiement });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(paiement));
      expect(comp.clientsSharedCollection).toContain(client);
      expect(comp.commercantsSharedCollection).toContain(commercant);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Paiement>>();
      const paiement = { id: 123 };
      jest.spyOn(paiementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paiement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paiement }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(paiementService.update).toHaveBeenCalledWith(paiement);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Paiement>>();
      const paiement = new Paiement();
      jest.spyOn(paiementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paiement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paiement }));
      saveSubject.complete();

      // THEN
      expect(paiementService.create).toHaveBeenCalledWith(paiement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Paiement>>();
      const paiement = { id: 123 };
      jest.spyOn(paiementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paiement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paiementService.update).toHaveBeenCalledWith(paiement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackClientById', () => {
      it('Should return tracked Client primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackClientById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCommercantById', () => {
      it('Should return tracked Commercant primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCommercantById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
