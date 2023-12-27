import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PettyCashDetailsComponent } from './petty-cash-details.component';

describe('PettyCashDetailsComponent', () => {
  let component: PettyCashDetailsComponent;
  let fixture: ComponentFixture<PettyCashDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PettyCashDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PettyCashDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
