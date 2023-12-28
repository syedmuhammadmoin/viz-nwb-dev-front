import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPettyCashComponent } from './list-petty-cash.component';

describe('ListPettyCashComponent', () => {
  let component: ListPettyCashComponent;
  let fixture: ComponentFixture<ListPettyCashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPettyCashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPettyCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
