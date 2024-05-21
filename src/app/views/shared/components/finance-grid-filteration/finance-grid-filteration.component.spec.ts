import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceGridFilterationComponent } from './finance-grid-filteration.component';

describe('FinanceGridFilterationComponent', () => {
  let component: FinanceGridFilterationComponent;
  let fixture: ComponentFixture<FinanceGridFilterationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceGridFilterationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceGridFilterationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
