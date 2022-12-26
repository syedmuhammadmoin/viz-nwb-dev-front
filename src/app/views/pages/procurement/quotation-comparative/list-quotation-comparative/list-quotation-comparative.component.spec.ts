import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListQuotationComparativeComponent } from './list-quotation-comparative.component';

describe('ListQuotationComparativeComponent', () => {
  let component: ListQuotationComparativeComponent;
  let fixture: ComponentFixture<ListQuotationComparativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListQuotationComparativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListQuotationComparativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
