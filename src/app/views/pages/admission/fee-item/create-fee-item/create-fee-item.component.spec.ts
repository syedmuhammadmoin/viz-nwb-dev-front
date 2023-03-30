import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFeeItemComponent } from './create-fee-item.component';

describe('CreateFeeItemComponent', () => {
  let component: CreateFeeItemComponent;
  let fixture: ComponentFixture<CreateFeeItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFeeItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFeeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
