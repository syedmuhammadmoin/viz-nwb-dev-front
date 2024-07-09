import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgingReportComponent } from './aging-report.component';

describe('AgingReportComponent', () => {
  let component: AgingReportComponent;
  let fixture: ComponentFixture<AgingReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
