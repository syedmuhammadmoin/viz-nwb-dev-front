import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdmissionCriteriaComponent } from './create-admission-criteria.component';

describe('CreateAdmissionCriteriaComponent', () => {
  let component: CreateAdmissionCriteriaComponent;
  let fixture: ComponentFixture<CreateAdmissionCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAdmissionCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAdmissionCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
