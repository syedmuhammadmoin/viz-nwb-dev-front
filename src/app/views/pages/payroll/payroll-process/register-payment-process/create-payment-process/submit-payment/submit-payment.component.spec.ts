import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitPaymentComponent } from './submit-payment.component';

describe('SubmitPaymentComponent', () => {
  let component: SubmitPaymentComponent;
  let fixture: ComponentFixture<SubmitPaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
