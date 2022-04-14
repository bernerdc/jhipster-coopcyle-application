import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TraderDetailComponent } from './trader-detail.component';

describe('Trader Management Detail Component', () => {
  let comp: TraderDetailComponent;
  let fixture: ComponentFixture<TraderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TraderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ trader: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TraderDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TraderDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load trader on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.trader).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
