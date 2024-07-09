import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintAssetMonthlyReportComponent } from './print-asset-monthly-report.component';

describe('PrintAssetMonthlyReportComponent', () => {
  let component: PrintAssetMonthlyReportComponent;
  let fixture: ComponentFixture<PrintAssetMonthlyReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintAssetMonthlyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintAssetMonthlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
