import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRegisterAssetComponent } from './print-register-asset.component';

describe('PrintRegisterAssetComponent', () => {
  let component: PrintRegisterAssetComponent;
  let fixture: ComponentFixture<PrintRegisterAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintRegisterAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintRegisterAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
