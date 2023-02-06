import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintQuotationComparativeComponent } from './print-quotation-comparative.component';

describe('PrintQuotationComparativeComponent', () => {
  let component: PrintQuotationComparativeComponent;
  let fixture: ComponentFixture<PrintQuotationComparativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintQuotationComparativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintQuotationComparativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
