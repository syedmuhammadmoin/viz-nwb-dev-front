import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationDetailComponent } from './activation-detail.component';

describe('ActivationDetailComponent', () => {
  let component: ActivationDetailComponent;
  let fixture: ComponentFixture<ActivationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
