import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisposalDetailsComponent } from './disposal-details.component';

describe('DisposalDetailsComponent', () => {
  let component: DisposalDetailsComponent;
  let fixture: ComponentFixture<DisposalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisposalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisposalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
