import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintIssuanceReturnComponent } from './print-issuance-return.component';

describe('PrintIssuanceReturnComponent', () => {
  let component: PrintIssuanceReturnComponent;
  let fixture: ComponentFixture<PrintIssuanceReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintIssuanceReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintIssuanceReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
