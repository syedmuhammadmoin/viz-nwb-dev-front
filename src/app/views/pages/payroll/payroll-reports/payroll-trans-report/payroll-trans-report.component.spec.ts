import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollTransReportComponent } from './payroll-trans-report.component';

describe('PayrollTransReportComponent', () => {
  let component: PayrollTransReportComponent;
  let fixture: ComponentFixture<PayrollTransReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollTransReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollTransReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
