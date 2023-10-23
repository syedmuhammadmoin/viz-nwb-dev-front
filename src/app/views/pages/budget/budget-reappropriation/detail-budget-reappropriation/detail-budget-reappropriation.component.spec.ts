import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBudgetReappropriationComponent } from './detail-budget-reappropriation.component';

describe('DetailBudgetReappropriationComponent', () => {
  let component: DetailBudgetReappropriationComponent;
  let fixture: ComponentFixture<DetailBudgetReappropriationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailBudgetReappropriationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailBudgetReappropriationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
