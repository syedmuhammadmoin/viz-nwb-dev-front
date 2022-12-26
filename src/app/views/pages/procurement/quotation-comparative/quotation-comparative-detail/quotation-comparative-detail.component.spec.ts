import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationComparativeDetailComponent } from './quotation-comparative-detail.component';

describe('QuotationComparativeDetailComponent', () => {
  let component: QuotationComparativeDetailComponent;
  let fixture: ComponentFixture<QuotationComparativeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationComparativeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationComparativeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
