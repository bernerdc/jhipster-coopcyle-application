import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TraderService } from '../service/trader.service';

import { TraderComponent } from './trader.component';

describe('Trader Management Component', () => {
  let comp: TraderComponent;
  let fixture: ComponentFixture<TraderComponent>;
  let service: TraderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TraderComponent],
    })
      .overrideTemplate(TraderComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TraderComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TraderService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.traders?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
