import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstimatedBudgetComponent } from './list-estimated-budget.component';

describe('ListEstimatedBudgetComponent', () => {
  let component: ListEstimatedBudgetComponent;
  let fixture: ComponentFixture<ListEstimatedBudgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEstimatedBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstimatedBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
