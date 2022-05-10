import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePayrollItemComponent } from './create-payroll-item.component';

describe('CreatePayrollItemComponent', () => {
  let component: CreatePayrollItemComponent;
  let fixture: ComponentFixture<CreatePayrollItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePayrollItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePayrollItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
