import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDepreciationAdjustmentComponent } from './print-depreciation-adjustment.component';

describe('PrintAssetAdjustmentComponent', () => {
  let component: PrintDepreciationAdjustmentComponent;
  let fixture: ComponentFixture<PrintDepreciationAdjustmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintDepreciationAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDepreciationAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
