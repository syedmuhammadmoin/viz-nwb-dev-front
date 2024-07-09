import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDepreciationAdjustmentComponent } from './create-depreciation-adjustment.component';

describe('CreateAssetAdjustmentComponent', () => {
  let component: CreateDepreciationAdjustmentComponent;
  let fixture: ComponentFixture<CreateDepreciationAdjustmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDepreciationAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDepreciationAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
