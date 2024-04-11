import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFeeComponent } from './list-fee.component';

describe('ListFeeComponent', () => {
  let component: ListFeeComponent;
  let fixture: ComponentFixture<ListFeeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
