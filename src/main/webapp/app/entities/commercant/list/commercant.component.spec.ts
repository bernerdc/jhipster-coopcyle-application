import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CommercantService } from '../service/commercant.service';

import { CommercantComponent } from './commercant.component';

describe('Commercant Management Component', () => {
  let comp: CommercantComponent;
  let fixture: ComponentFixture<CommercantComponent>;
  let service: CommercantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CommercantComponent],
    })
      .overrideTemplate(CommercantComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommercantComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CommercantService);

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
    expect(comp.commercants?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
