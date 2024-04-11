import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBusinessPartnerComponent } from './print-business-partner.component';

describe('PrintBusinessPartnerComponent', () => {
  let component: PrintBusinessPartnerComponent;
  let fixture: ComponentFixture<PrintBusinessPartnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintBusinessPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintBusinessPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
