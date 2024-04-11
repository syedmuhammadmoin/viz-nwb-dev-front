import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwipDetailsComponent } from './cwip-details.component';

describe('CwipDetailsComponent', () => {
  let component: CwipDetailsComponent;
  let fixture: ComponentFixture<CwipDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CwipDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwipDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
