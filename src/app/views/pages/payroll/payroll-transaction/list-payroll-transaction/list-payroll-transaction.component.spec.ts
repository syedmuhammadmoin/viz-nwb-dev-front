import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPayrollTransactionComponent } from './list-payroll-transaction.component';

describe('ListPayrollTransactionComponent', () => {
  let component: ListPayrollTransactionComponent;
  let fixture: ComponentFixture<ListPayrollTransactionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPayrollTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPayrollTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
