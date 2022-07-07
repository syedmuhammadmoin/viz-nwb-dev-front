import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRemarksComponent } from './show-remarks.component';

describe('ShowRemarksComponent', () => {
  let component: ShowRemarksComponent;
  let fixture: ComponentFixture<ShowRemarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowRemarksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
