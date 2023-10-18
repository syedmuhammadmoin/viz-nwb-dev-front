import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBudgetReappropriationComponent } from './list-budget-reappropriation.component';

describe('ListBudgetReappropriationComponent', () => {
  let component: ListBudgetReappropriationComponent;
  let fixture: ComponentFixture<ListBudgetReappropriationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBudgetReappropriationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBudgetReappropriationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
