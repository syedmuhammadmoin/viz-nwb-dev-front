import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDeparmentComponent } from './list-deparment.component';

describe('ListDeparmentComponent', () => {
  let component: ListDeparmentComponent;
  let fixture: ComponentFixture<ListDeparmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDeparmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDeparmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
