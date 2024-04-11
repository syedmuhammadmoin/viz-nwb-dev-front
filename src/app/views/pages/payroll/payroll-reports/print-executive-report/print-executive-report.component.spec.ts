import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintExecutiveReportComponent } from './print-executive-report.component';

describe('PrintExecutiveReportComponent', () => {
  let component: PrintExecutiveReportComponent;
  let fixture: ComponentFixture<PrintExecutiveReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintExecutiveReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintExecutiveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
