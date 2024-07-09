import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDepreciationAdjustmentComponent } from './list-depreciation-adjustment.component';

describe('ListAssetAdjustmentComponent', () => {
  let component: ListDepreciationAdjustmentComponent;
  let fixture: ComponentFixture<ListDepreciationAdjustmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDepreciationAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDepreciationAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
