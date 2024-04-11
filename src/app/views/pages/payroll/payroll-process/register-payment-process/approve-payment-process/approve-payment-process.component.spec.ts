import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePaymentProcessComponent } from './approve-payment-process.component';

describe('ApprovePaymentProcessComponent', () => {
  let component: ApprovePaymentProcessComponent;
  let fixture: ComponentFixture<ApprovePaymentProcessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovePaymentProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovePaymentProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
