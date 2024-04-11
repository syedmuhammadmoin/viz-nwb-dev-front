import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBidEvaluationComponent } from './list-bid-evaluation.component';

describe('ListBidEvaluationComponent', () => {
  let component: ListBidEvaluationComponent;
  let fixture: ComponentFixture<ListBidEvaluationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBidEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBidEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
