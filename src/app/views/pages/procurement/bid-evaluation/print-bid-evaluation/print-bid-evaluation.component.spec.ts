import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBidEvaluationComponent } from './print-bid-evaluation.component';

describe('PrintBidEvaluationComponent', () => {
  let component: PrintBidEvaluationComponent;
  let fixture: ComponentFixture<PrintBidEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintBidEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintBidEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
