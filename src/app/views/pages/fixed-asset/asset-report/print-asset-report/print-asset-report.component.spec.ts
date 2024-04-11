import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintAssetReportComponent } from './print-asset-report.component';

describe('PrintAssetReportComponent', () => {
  let component: PrintAssetReportComponent;
  let fixture: ComponentFixture<PrintAssetReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintAssetReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintAssetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
