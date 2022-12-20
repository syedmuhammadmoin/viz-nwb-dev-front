import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestRequisitionDetailsComponent } from './request-requisition-details.component';

describe('RequestRequisitionDetailsComponent', () => {
  let component: RequestRequisitionDetailsComponent;
  let fixture: ComponentFixture<RequestRequisitionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestRequisitionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestRequisitionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
