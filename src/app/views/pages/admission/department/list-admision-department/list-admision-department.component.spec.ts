import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAdmisionDepartmentComponent } from './list-admision-department.component';

describe('ListAdmisionDepartmentComponent', () => {
  let component: ListAdmisionDepartmentComponent;
  let fixture: ComponentFixture<ListAdmisionDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAdmisionDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAdmisionDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
