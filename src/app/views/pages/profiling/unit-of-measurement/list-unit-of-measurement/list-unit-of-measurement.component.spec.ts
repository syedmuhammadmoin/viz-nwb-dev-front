import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUnitOfMeasurementComponent } from './list-unit-of-measurement.component';

describe('ListUnitOfMeasurementComponent', () => {
  let component: ListUnitOfMeasurementComponent;
  let fixture: ComponentFixture<ListUnitOfMeasurementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUnitOfMeasurementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUnitOfMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
