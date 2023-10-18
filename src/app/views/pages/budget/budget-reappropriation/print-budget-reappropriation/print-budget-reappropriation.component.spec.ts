import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBudgetReappropriationComponent } from './print-budget-reappropriation.component';

describe('PrintBudgetReappropriationComponent', () => {
  let component: PrintBudgetReappropriationComponent;
  let fixture: ComponentFixture<PrintBudgetReappropriationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintBudgetReappropriationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintBudgetReappropriationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
