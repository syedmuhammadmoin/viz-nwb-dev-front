import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuanceReturnDetailComponent } from './issuance-return-detail.component';

describe('IssuanceReturnDetailComponent', () => {
  let component: IssuanceReturnDetailComponent;
  let fixture: ComponentFixture<IssuanceReturnDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuanceReturnDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuanceReturnDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
