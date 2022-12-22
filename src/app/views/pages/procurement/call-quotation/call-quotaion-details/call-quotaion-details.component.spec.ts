import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallQuotaionDetailsComponent } from './call-quotaion-details.component';

describe('CallQuotaionDetailsComponent', () => {
  let component: CallQuotaionDetailsComponent;
  let fixture: ComponentFixture<CallQuotaionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallQuotaionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallQuotaionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
