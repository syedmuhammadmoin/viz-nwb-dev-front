import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintProfitNLossComponent } from './print-profit-n-loss.component';

describe('PrintProfitNLossComponent', () => {
  let component: PrintProfitNLossComponent;
  let fixture: ComponentFixture<PrintProfitNLossComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintProfitNLossComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintProfitNLossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
