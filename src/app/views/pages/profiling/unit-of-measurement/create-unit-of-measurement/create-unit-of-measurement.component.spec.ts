import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUnitOfMeasurementComponent } from './create-unit-of-measurement.component';

describe('CreateUnitOfMeasurementComponent', () => {
  let component: CreateUnitOfMeasurementComponent;
  let fixture: ComponentFixture<CreateUnitOfMeasurementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUnitOfMeasurementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUnitOfMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
