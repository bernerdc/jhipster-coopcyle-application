import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OrderService } from '../service/order.service';
import { IOrder, Order } from '../order.model';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { IDeliveryMan } from 'app/entities/delivery-man/delivery-man.model';
import { DeliveryManService } from 'app/entities/delivery-man/service/delivery-man.service';
import { ITrader } from 'app/entities/trader/trader.model';
import { TraderService } from 'app/entities/trader/service/trader.service';

import { OrderUpdateComponent } from './order-update.component';

describe('Order Management Update Component', () => {
  let comp: OrderUpdateComponent;
  let fixture: ComponentFixture<OrderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let orderService: OrderService;
  let clientService: ClientService;
  let deliveryManService: DeliveryManService;
  let traderService: TraderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrderUpdateComponent],
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
      .overrideTemplate(OrderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    orderService = TestBed.inject(OrderService);
    clientService = TestBed.inject(ClientService);
    deliveryManService = TestBed.inject(DeliveryManService);
    traderService = TestBed.inject(TraderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Client query and add missing value', () => {
      const order: IOrder = { id: 456 };
      const client: IClient = { id: 95691 };
      order.client = client;

      const clientCollection: IClient[] = [{ id: 87981 }];
      jest.spyOn(clientService, 'query').mockReturnValue(of(new HttpResponse({ body: clientCollection })));
      const additionalClients = [client];
      const expectedCollection: IClient[] = [...additionalClients, ...clientCollection];
      jest.spyOn(clientService, 'addClientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ order });
      comp.ngOnInit();

      expect(clientService.query).toHaveBeenCalled();
      expect(clientService.addClientToCollectionIfMissing).toHaveBeenCalledWith(clientCollection, ...additionalClients);
      expect(comp.clientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call DeliveryMan query and add missing value', () => {
      const order: IOrder = { id: 456 };
      const deliveryMan: IDeliveryMan = { id: 24182 };
      order.deliveryMan = deliveryMan;

      const deliveryManCollection: IDeliveryMan[] = [{ id: 75747 }];
      jest.spyOn(deliveryManService, 'query').mockReturnValue(of(new HttpResponse({ body: deliveryManCollection })));
      const additionalDeliveryMen = [deliveryMan];
      const expectedCollection: IDeliveryMan[] = [...additionalDeliveryMen, ...deliveryManCollection];
      jest.spyOn(deliveryManService, 'addDeliveryManToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ order });
      comp.ngOnInit();

      expect(deliveryManService.query).toHaveBeenCalled();
      expect(deliveryManService.addDeliveryManToCollectionIfMissing).toHaveBeenCalledWith(deliveryManCollection, ...additionalDeliveryMen);
      expect(comp.deliveryMenSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Trader query and add missing value', () => {
      const order: IOrder = { id: 456 };
      const trader: ITrader = { id: 3668 };
      order.trader = trader;

      const traderCollection: ITrader[] = [{ id: 49963 }];
      jest.spyOn(traderService, 'query').mockReturnValue(of(new HttpResponse({ body: traderCollection })));
      const additionalTraders = [trader];
      const expectedCollection: ITrader[] = [...additionalTraders, ...traderCollection];
      jest.spyOn(traderService, 'addTraderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ order });
      comp.ngOnInit();

      expect(traderService.query).toHaveBeenCalled();
      expect(traderService.addTraderToCollectionIfMissing).toHaveBeenCalledWith(traderCollection, ...additionalTraders);
      expect(comp.tradersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const order: IOrder = { id: 456 };
      const client: IClient = { id: 8912 };
      order.client = client;
      const deliveryMan: IDeliveryMan = { id: 48686 };
      order.deliveryMan = deliveryMan;
      const trader: ITrader = { id: 86818 };
      order.trader = trader;

      activatedRoute.data = of({ order });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(order));
      expect(comp.clientsSharedCollection).toContain(client);
      expect(comp.deliveryMenSharedCollection).toContain(deliveryMan);
      expect(comp.tradersSharedCollection).toContain(trader);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Order>>();
      const order = { id: 123 };
      jest.spyOn(orderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ order });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: order }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(orderService.update).toHaveBeenCalledWith(order);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Order>>();
      const order = new Order();
      jest.spyOn(orderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ order });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: order }));
      saveSubject.complete();

      // THEN
      expect(orderService.create).toHaveBeenCalledWith(order);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Order>>();
      const order = { id: 123 };
      jest.spyOn(orderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ order });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(orderService.update).toHaveBeenCalledWith(order);
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

    describe('trackDeliveryManById', () => {
      it('Should return tracked DeliveryMan primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDeliveryManById(0, entity);
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
