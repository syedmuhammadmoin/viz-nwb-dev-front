import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAddmissionDepartmentComponent } from './create-addmission-department.component';

describe('CreateAddmissionDepartmentComponent', () => {
  let component: CreateAddmissionDepartmentComponent;
  let fixture: ComponentFixture<CreateAddmissionDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAddmissionDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAddmissionDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
