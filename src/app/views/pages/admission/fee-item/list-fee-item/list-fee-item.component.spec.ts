import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFeeItemComponent } from './list-fee-item.component';

describe('ListFeeItemComponent', () => {
  let component: ListFeeItemComponent;
  let fixture: ComponentFixture<ListFeeItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFeeItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFeeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
