import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRequestRequisitionComponent } from './create-request-requisition.component';

describe('CreateRequestRequisitionComponent', () => {
  let component: CreateRequestRequisitionComponent;
  let fixture: ComponentFixture<CreateRequestRequisitionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRequestRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRequestRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
