import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PaymentService } from '../service/payment.service';
import { IPayment, Payment } from '../payment.model';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { ITrader } from 'app/entities/trader/trader.model';
import { TraderService } from 'app/entities/trader/service/trader.service';

import { PaymentUpdateComponent } from './payment-update.component';

describe('Payment Management Update Component', () => {
  let comp: PaymentUpdateComponent;
  let fixture: ComponentFixture<PaymentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paymentService: PaymentService;
  let clientService: ClientService;
  let traderService: TraderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PaymentUpdateComponent],
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
      .overrideTemplate(PaymentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PaymentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paymentService = TestBed.inject(PaymentService);
    clientService = TestBed.inject(ClientService);
    traderService = TestBed.inject(TraderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Client query and add missing value', () => {
      const payment: IPayment = { id: 456 };
      const client: IClient = { id: 68474 };
      payment.client = client;

      const clientCollection: IClient[] = [{ id: 72429 }];
      jest.spyOn(clientService, 'query').mockReturnValue(of(new HttpResponse({ body: clientCollection })));
      const additionalClients = [client];
      const expectedCollection: IClient[] = [...additionalClients, ...clientCollection];
      jest.spyOn(clientService, 'addClientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ payment });
      comp.ngOnInit();

      expect(clientService.query).toHaveBeenCalled();
      expect(clientService.addClientToCollectionIfMissing).toHaveBeenCalledWith(clientCollection, ...additionalClients);
      expect(comp.clientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Trader query and add missing value', () => {
      const payment: IPayment = { id: 456 };
      const trader: ITrader = { id: 47795 };
      payment.trader = trader;

      const traderCollection: ITrader[] = [{ id: 1944 }];
      jest.spyOn(traderService, 'query').mockReturnValue(of(new HttpResponse({ body: traderCollection })));
      const additionalTraders = [trader];
      const expectedCollection: ITrader[] = [...additionalTraders, ...traderCollection];
      jest.spyOn(traderService, 'addTraderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ payment });
      comp.ngOnInit();

      expect(traderService.query).toHaveBeenCalled();
      expect(traderService.addTraderToCollectionIfMissing).toHaveBeenCalledWith(traderCollection, ...additionalTraders);
      expect(comp.tradersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const payment: IPayment = { id: 456 };
      const client: IClient = { id: 89652 };
      payment.client = client;
      const trader: ITrader = { id: 86006 };
      payment.trader = trader;

      activatedRoute.data = of({ payment });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(payment));
      expect(comp.clientsSharedCollection).toContain(client);
      expect(comp.tradersSharedCollection).toContain(trader);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Payment>>();
      const payment = { id: 123 };
      jest.spyOn(paymentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: payment }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(paymentService.update).toHaveBeenCalledWith(payment);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Payment>>();
      const payment = new Payment();
      jest.spyOn(paymentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: payment }));
      saveSubject.complete();

      // THEN
      expect(paymentService.create).toHaveBeenCalledWith(payment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Payment>>();
      const payment = { id: 123 };
      jest.spyOn(paymentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ payment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paymentService.update).toHaveBeenCalledWith(payment);
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

    describe('trackTraderById', () => {
      it('Should return tracked Trader primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTraderById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
