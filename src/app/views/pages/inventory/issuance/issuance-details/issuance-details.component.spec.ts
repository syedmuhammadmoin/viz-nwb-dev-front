import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuanceDetailsComponent } from './issuance-details.component';

describe('IssuanceDetailsComponent', () => {
  let component: IssuanceDetailsComponent;
  let fixture: ComponentFixture<IssuanceDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuanceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
