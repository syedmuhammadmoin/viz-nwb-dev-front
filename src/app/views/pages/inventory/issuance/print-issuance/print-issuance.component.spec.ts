import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintIssuanceComponent } from './print-issuance.component';

describe('PrintIssuanceComponent', () => {
  let component: PrintIssuanceComponent;
  let fixture: ComponentFixture<PrintIssuanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintIssuanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintIssuanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
