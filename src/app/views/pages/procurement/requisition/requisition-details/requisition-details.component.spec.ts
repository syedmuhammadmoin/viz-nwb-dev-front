import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionDetailsComponent } from './requisition-details.component';

describe('RequisitionDetailsComponent', () => {
  let component: RequisitionDetailsComponent;
  let fixture: ComponentFixture<RequisitionDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequisitionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
