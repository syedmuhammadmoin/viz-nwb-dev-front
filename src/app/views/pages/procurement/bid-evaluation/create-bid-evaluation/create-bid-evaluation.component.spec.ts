import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBidEvaluationComponent } from './create-bid-evaluation.component';

describe('CreateBidEvaluationComponent', () => {
  let component: CreateBidEvaluationComponent;
  let fixture: ComponentFixture<CreateBidEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBidEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBidEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
