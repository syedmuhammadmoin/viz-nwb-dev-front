import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubjectComponent } from './create-subject.component';

describe('CreateSubjectComponent', () => {
  let component: CreateSubjectComponent;
  let fixture: ComponentFixture<CreateSubjectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
