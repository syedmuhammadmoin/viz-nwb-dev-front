import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBudgetReappropriationComponent } from './create-budget-reappropriation.component';

describe('CreateBudgetReappropriationComponent', () => {
  let component: CreateBudgetReappropriationComponent;
  let fixture: ComponentFixture<CreateBudgetReappropriationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBudgetReappropriationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBudgetReappropriationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
