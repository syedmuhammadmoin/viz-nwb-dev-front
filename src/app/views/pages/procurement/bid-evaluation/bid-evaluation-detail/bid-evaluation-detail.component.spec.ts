import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidEvaluationDetailComponent } from './bid-evaluation-detail.component';

describe('BidEvaluationDetailComponent', () => {
  let component: BidEvaluationDetailComponent;
  let fixture: ComponentFixture<BidEvaluationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidEvaluationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidEvaluationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
