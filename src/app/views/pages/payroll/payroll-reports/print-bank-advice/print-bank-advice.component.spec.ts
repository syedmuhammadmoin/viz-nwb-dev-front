import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBankAdviceComponent } from './print-bank-advice.component';

describe('PrintBankAdviceComponent', () => {
  let component: PrintBankAdviceComponent;
  let fixture: ComponentFixture<PrintBankAdviceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintBankAdviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintBankAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
