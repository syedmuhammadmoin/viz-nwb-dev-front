import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuanceReturnDetailComponent } from './issuance-return-detail.component';

describe('IssuanceReturnDetailComponent', () => {
  let component: IssuanceReturnDetailComponent;
  let fixture: ComponentFixture<IssuanceReturnDetailComponent>;

  beforeEach(async(() => {
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
