import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPayrollTransactionComponent } from './print-payroll-transaction.component';

describe('PrintPayrollTransactionComponent', () => {
  let component: PrintPayrollTransactionComponent;
  let fixture: ComponentFixture<PrintPayrollTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintPayrollTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPayrollTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
