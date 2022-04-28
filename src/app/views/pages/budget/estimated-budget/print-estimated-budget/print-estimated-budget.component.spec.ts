import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintEstimatedBudgetComponent } from './print-estimated-budget.component';

describe('PrintEstimatedBudgetComponent', () => {
  let component: PrintEstimatedBudgetComponent;
  let fixture: ComponentFixture<PrintEstimatedBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintEstimatedBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintEstimatedBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
