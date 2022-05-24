import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePayrollProcessComponent } from './approve-payroll-process.component';

describe('ApprovePayrollProcessComponent', () => {
  let component: ApprovePayrollProcessComponent;
  let fixture: ComponentFixture<ApprovePayrollProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovePayrollProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovePayrollProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
