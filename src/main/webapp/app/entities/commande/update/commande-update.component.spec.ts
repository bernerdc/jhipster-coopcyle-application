import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CommandeService } from '../service/commande.service';
import { ICommande, Commande } from '../commande.model';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { ILivreur } from 'app/entities/livreur/livreur.model';
import { LivreurService } from 'app/entities/livreur/service/livreur.service';
import { ICommercant } from 'app/entities/commercant/commercant.model';
import { CommercantService } from 'app/entities/commercant/service/commercant.service';

import { CommandeUpdateComponent } from './commande-update.component';

describe('Commande Management Update Component', () => {
  let comp: CommandeUpdateComponent;
  let fixture: ComponentFixture<CommandeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let commandeService: CommandeService;
  let clientService: ClientService;
  let livreurService: LivreurService;
  let commercantService: CommercantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CommandeUpdateComponent],
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
      .overrideTemplate(CommandeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommandeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    commandeService = TestBed.inject(CommandeService);
    clientService = TestBed.inject(ClientService);
    livreurService = TestBed.inject(LivreurService);
    commercantService = TestBed.inject(CommercantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Client query and add missing value', () => {
      const commande: ICommande = { id: 456 };
      const client: IClient = { id: 20505 };
      commande.client = client;

      const clientCollection: IClient[] = [{ id: 77784 }];
      jest.spyOn(clientService, 'query').mockReturnValue(of(new HttpResponse({ body: clientCollection })));
      const additionalClients = [client];
      const expectedCollection: IClient[] = [...additionalClients, ...clientCollection];
      jest.spyOn(clientService, 'addClientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ commande });
      comp.ngOnInit();

      expect(clientService.query).toHaveBeenCalled();
      expect(clientService.addClientToCollectionIfMissing).toHaveBeenCalledWith(clientCollection, ...additionalClients);
      expect(comp.clientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Livreur query and add missing value', () => {
      const commande: ICommande = { id: 456 };
      const livreur: ILivreur = { id: 17155 };
      commande.livreur = livreur;

      const livreurCollection: ILivreur[] = [{ id: 2050 }];
      jest.spyOn(livreurService, 'query').mockReturnValue(of(new HttpResponse({ body: livreurCollection })));
      const additionalLivreurs = [livreur];
      const expectedCollection: ILivreur[] = [...additionalLivreurs, ...livreurCollection];
      jest.spyOn(livreurService, 'addLivreurToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ commande });
      comp.ngOnInit();

      expect(livreurService.query).toHaveBeenCalled();
      expect(livreurService.addLivreurToCollectionIfMissing).toHaveBeenCalledWith(livreurCollection, ...additionalLivreurs);
      expect(comp.livreursSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Commercant query and add missing value', () => {
      const commande: ICommande = { id: 456 };
      const commercant: ICommercant = { id: 89987 };
      commande.commercant = commercant;

      const commercantCollection: ICommercant[] = [{ id: 38006 }];
      jest.spyOn(commercantService, 'query').mockReturnValue(of(new HttpResponse({ body: commercantCollection })));
      const additionalCommercants = [commercant];
      const expectedCollection: ICommercant[] = [...additionalCommercants, ...commercantCollection];
      jest.spyOn(commercantService, 'addCommercantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ commande });
      comp.ngOnInit();

      expect(commercantService.query).toHaveBeenCalled();
      expect(commercantService.addCommercantToCollectionIfMissing).toHaveBeenCalledWith(commercantCollection, ...additionalCommercants);
      expect(comp.commercantsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const commande: ICommande = { id: 456 };
      const client: IClient = { id: 51829 };
      commande.client = client;
      const livreur: ILivreur = { id: 33969 };
      commande.livreur = livreur;
      const commercant: ICommercant = { id: 94943 };
      commande.commercant = commercant;

      activatedRoute.data = of({ commande });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(commande));
      expect(comp.clientsSharedCollection).toContain(client);
      expect(comp.livreursSharedCollection).toContain(livreur);
      expect(comp.commercantsSharedCollection).toContain(commercant);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Commande>>();
      const commande = { id: 123 };
      jest.spyOn(commandeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ commande });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: commande }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(commandeService.update).toHaveBeenCalledWith(commande);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Commande>>();
      const commande = new Commande();
      jest.spyOn(commandeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ commande });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: commande }));
      saveSubject.complete();

      // THEN
      expect(commandeService.create).toHaveBeenCalledWith(commande);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Commande>>();
      const commande = { id: 123 };
      jest.spyOn(commandeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ commande });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(commandeService.update).toHaveBeenCalledWith(commande);
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

    describe('trackLivreurById', () => {
      it('Should return tracked Livreur primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLivreurById(0, entity);
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
