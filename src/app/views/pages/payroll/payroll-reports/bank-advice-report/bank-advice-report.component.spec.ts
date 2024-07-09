import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAdviceReportComponent } from './bank-advice-report.component';

describe('BankAdviceReportComponent', () => {
  let component: BankAdviceReportComponent;
  let fixture: ComponentFixture<BankAdviceReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BankAdviceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAdviceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
