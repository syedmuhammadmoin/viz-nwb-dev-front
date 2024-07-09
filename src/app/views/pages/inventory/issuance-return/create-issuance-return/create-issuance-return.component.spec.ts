import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIssuanceReturnComponent } from './create-issuance-return.component';

describe('CreateIssuanceReturnComponent', () => {
  let component: CreateIssuanceReturnComponent;
  let fixture: ComponentFixture<CreateIssuanceReturnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateIssuanceReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIssuanceReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
