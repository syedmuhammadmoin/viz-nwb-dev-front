import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDepreciationComponent } from './schedule-depreciation.component';

describe('ScheduleDepreciationComponent', () => {
  let component: ScheduleDepreciationComponent;
  let fixture: ComponentFixture<ScheduleDepreciationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleDepreciationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDepreciationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
