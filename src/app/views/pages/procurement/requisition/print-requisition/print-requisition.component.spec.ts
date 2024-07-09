import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRequisitionComponent } from './print-requisition.component';

describe('PrintRequisitionComponent', () => {
  let component: PrintRequisitionComponent;
  let fixture: ComponentFixture<PrintRequisitionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
