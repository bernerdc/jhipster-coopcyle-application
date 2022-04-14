import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DeliveryManDetailComponent } from './delivery-man-detail.component';

describe('DeliveryMan Management Detail Component', () => {
  let comp: DeliveryManDetailComponent;
  let fixture: ComponentFixture<DeliveryManDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryManDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ deliveryMan: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DeliveryManDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DeliveryManDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load deliveryMan on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.deliveryMan).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
