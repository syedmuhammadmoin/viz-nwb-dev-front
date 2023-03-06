import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBudgetReapprpriationComponent } from './detail-budget-reapprpriation.component';

describe('DetailBudgetReapprpriationComponent', () => {
  let component: DetailBudgetReapprpriationComponent;
  let fixture: ComponentFixture<DetailBudgetReapprpriationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailBudgetReapprpriationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailBudgetReapprpriationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
