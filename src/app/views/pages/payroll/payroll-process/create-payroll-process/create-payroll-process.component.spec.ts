import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePayrollProcessComponent } from './create-payroll-process.component';

describe('CreatePayrollProcessComponent', () => {
  let component: CreatePayrollProcessComponent;
  let fixture: ComponentFixture<CreatePayrollProcessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePayrollProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePayrollProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
