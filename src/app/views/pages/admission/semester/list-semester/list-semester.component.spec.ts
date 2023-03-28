import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSemesterComponent } from './list-semester.component';

describe('ListSemesterComponent', () => {
  let component: ListSemesterComponent;
  let fixture: ComponentFixture<ListSemesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSemesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSemesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
