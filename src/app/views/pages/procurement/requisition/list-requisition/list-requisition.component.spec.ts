import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRequisitionComponent } from './list-requisition.component';

describe('ListRequisitionComponent', () => {
  let component: ListRequisitionComponent;
  let fixture: ComponentFixture<ListRequisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
