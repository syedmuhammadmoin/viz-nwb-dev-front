import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEstimatedBudgetComponent } from './create-estimated-budget.component';

describe('CreateEstimatedBudgetComponent', () => {
  let component: CreateEstimatedBudgetComponent;
  let fixture: ComponentFixture<CreateEstimatedBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEstimatedBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEstimatedBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
