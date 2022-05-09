import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEstimatedBudgetComponent } from './detail-estimated-budget.component';

describe('DetailEstimatedBudgetComponent', () => {
  let component: DetailEstimatedBudgetComponent;
  let fixture: ComponentFixture<DetailEstimatedBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailEstimatedBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailEstimatedBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
