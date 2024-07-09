import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFacultyComponent } from './create-faculty.component';

describe('CreateFacultyComponent', () => {
  let component: CreateFacultyComponent;
  let fixture: ComponentFixture<CreateFacultyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFacultyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
