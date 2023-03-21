import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssessmentCriteriaComponent } from './create-assessment-criteria.component';

describe('CreateAssessmentCriteriaComponent', () => {
  let component: CreateAssessmentCriteriaComponent;
  let fixture: ComponentFixture<CreateAssessmentCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAssessmentCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAssessmentCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
