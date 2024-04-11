import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardVendorComponent } from './award-vendor.component';

describe('AwardVendorComponent', () => {
  let component: AwardVendorComponent;
  let fixture: ComponentFixture<AwardVendorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
