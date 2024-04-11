import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollTransactionDetailComponent } from './payroll-transaction-detail.component';

describe('PayrollTransactionDetailComponent', () => {
  let component: PayrollTransactionDetailComponent;
  let fixture: ComponentFixture<PayrollTransactionDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollTransactionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollTransactionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
