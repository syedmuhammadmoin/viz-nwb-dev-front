import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAcademicDepartmentComponent } from './create-academic-department.component';

describe('CreateAcademicDepartmentComponent', () => {
  let component: CreateAcademicDepartmentComponent;
  let fixture: ComponentFixture<CreateAcademicDepartmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAcademicDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAcademicDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
