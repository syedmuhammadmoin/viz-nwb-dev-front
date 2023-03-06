import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBudgetReappropiationComponent } from './list-budget-reappropiation.component';

describe('ListBudgetReappropiationComponent', () => {
  let component: ListBudgetReappropiationComponent;
  let fixture: ComponentFixture<ListBudgetReappropiationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBudgetReappropiationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBudgetReappropiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
