import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQualificationComponent } from './create-qualification.component';

describe('CreateQualificationComponent', () => {
  let component: CreateQualificationComponent;
  let fixture: ComponentFixture<CreateQualificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQualificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
