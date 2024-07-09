import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBatchTypeComponent } from './create-batch-type.component';

describe('CreateBatchTypeComponent', () => {
  let component: CreateBatchTypeComponent;
  let fixture: ComponentFixture<CreateBatchTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBatchTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBatchTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
