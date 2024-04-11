import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBudgetComponent } from './print-budget.component';

describe('PrintBudgetComponent', () => {
  let component: PrintBudgetComponent;
  let fixture: ComponentFixture<PrintBudgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
