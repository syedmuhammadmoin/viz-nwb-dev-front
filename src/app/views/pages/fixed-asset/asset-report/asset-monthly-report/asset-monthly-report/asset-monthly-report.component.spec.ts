import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMonthlyReportComponent } from './asset-monthly-report.component';

describe('AssetMonthlyReportComponent', () => {
  let component: AssetMonthlyReportComponent;
  let fixture: ComponentFixture<AssetMonthlyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetMonthlyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMonthlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
