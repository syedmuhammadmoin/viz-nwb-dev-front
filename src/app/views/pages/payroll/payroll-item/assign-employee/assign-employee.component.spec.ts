import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEmployeeComponent } from './assign-employee.component';

describe('AssignEmployeeComponent', () => {
  let component: AssignEmployeeComponent;
  let fixture: ComponentFixture<AssignEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
