import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPayrollItemComponent } from './list-payroll-item.component';

describe('ListPayrollItemComponent', () => {
  let component: ListPayrollItemComponent;
  let fixture: ComponentFixture<ListPayrollItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPayrollItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPayrollItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
