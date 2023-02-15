import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintAssetComponent } from './print-asset.component';

describe('PrintAssetComponent', () => {
  let component: PrintAssetComponent;
  let fixture: ComponentFixture<PrintAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
