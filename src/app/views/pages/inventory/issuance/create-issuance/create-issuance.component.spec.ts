import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIssuanceComponent } from './create-issuance.component';

describe('CreateIssuanceComponent', () => {
  let component: CreateIssuanceComponent;
  let fixture: ComponentFixture<CreateIssuanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateIssuanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIssuanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
