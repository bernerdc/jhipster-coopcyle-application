import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CommercantDetailComponent } from './commercant-detail.component';

describe('Commercant Management Detail Component', () => {
  let comp: CommercantDetailComponent;
  let fixture: ComponentFixture<CommercantDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommercantDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ commercant: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CommercantDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CommercantDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load commercant on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.commercant).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
