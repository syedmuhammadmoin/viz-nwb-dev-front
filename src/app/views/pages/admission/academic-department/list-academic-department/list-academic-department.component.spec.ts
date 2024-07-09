import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAcademicDepartmentComponent } from './list-academic-department.component';

describe('ListAcademicDepartmentComponent', () => {
  let component: ListAcademicDepartmentComponent;
  let fixture: ComponentFixture<ListAcademicDepartmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAcademicDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAcademicDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
