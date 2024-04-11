import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollExecutiveReportComponent } from './payroll-executive-report.component';

describe('PayrollExecutiveReportComponent', () => {
  let component: PayrollExecutiveReportComponent;
  let fixture: ComponentFixture<PayrollExecutiveReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollExecutiveReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollExecutiveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
