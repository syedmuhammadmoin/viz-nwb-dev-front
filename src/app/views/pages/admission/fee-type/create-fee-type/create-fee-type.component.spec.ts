import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFeeTypeComponent } from './create-fee-type.component';

describe('CreateFeeTypeComponent', () => {
  let component: CreateFeeTypeComponent;
  let fixture: ComponentFixture<CreateFeeTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFeeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFeeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
