import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuotationComparativeComponent } from './create-quotation-comparative.component';

describe('CreateQuotationComparativeComponent', () => {
  let component: CreateQuotationComparativeComponent;
  let fixture: ComponentFixture<CreateQuotationComparativeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQuotationComparativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuotationComparativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
