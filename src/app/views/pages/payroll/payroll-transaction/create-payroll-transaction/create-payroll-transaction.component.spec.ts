import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePayrollTransactionComponent } from './create-payroll-transaction.component';

describe('CreatePayrollTransactionComponent', () => {
  let component: CreatePayrollTransactionComponent;
  let fixture: ComponentFixture<CreatePayrollTransactionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePayrollTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePayrollTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
