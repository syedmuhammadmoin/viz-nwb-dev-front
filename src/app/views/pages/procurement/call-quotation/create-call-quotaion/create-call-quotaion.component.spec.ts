import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCallQuotaionComponent } from './create-call-quotaion.component';

describe('CreateCallQuotaionComponent', () => {
  let component: CreateCallQuotaionComponent;
  let fixture: ComponentFixture<CreateCallQuotaionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCallQuotaionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCallQuotaionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
