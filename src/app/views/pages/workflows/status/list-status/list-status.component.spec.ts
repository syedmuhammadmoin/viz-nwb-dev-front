import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStatusComponent } from './list-status.component';

describe('ListStatusComponent', () => {
  let component: ListStatusComponent;
  let fixture: ComponentFixture<ListStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
