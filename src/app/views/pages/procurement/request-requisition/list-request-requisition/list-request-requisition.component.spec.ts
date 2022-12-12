import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRequestRequisitionComponent } from './list-request-requisition.component';

describe('ListRequestRequisitionComponent', () => {
  let component: ListRequestRequisitionComponent;
  let fixture: ComponentFixture<ListRequestRequisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRequestRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRequestRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
