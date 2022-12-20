import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintQuotationComponent } from './print-quotation.component';

describe('PrintQuotationComponent', () => {
  let component: PrintQuotationComponent;
  let fixture: ComponentFixture<PrintQuotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintQuotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
