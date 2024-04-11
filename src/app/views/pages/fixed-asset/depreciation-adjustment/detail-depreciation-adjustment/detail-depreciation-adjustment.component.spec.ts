import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDepreciationAdjustmentComponent } from './detail-depreciation-adjustment.component';

describe('DetailAssetAdjustmentComponent', () => {
  let component: DetailDepreciationAdjustmentComponent;
  let fixture: ComponentFixture<DetailDepreciationAdjustmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailDepreciationAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDepreciationAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
