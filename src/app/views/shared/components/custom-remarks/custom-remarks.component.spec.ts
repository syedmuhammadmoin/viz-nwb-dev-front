import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRemarksComponent } from './custom-remarks.component';

describe('CustomRemarksComponent', () => {
  let component: CustomRemarksComponent;
  let fixture: ComponentFixture<CustomRemarksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomRemarksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
