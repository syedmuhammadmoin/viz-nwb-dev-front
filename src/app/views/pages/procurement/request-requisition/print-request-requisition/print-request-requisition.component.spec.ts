import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRequestRequisitionComponent } from './print-request-requisition.component';

describe('PrintRequestRequisitionComponent', () => {
  let component: PrintRequestRequisitionComponent;
  let fixture: ComponentFixture<PrintRequestRequisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintRequestRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintRequestRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
