import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBudgetReappropiationComponent } from './create-budget-reappropiation.component';

describe('CreateBudgetReappropiationComponent', () => {
  let component: CreateBudgetReappropiationComponent;
  let fixture: ComponentFixture<CreateBudgetReappropiationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBudgetReappropiationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBudgetReappropiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
