import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFacultyComponent } from './list-faculty.component';

describe('ListFacultyComponent', () => {
  let component: ListFacultyComponent;
  let fixture: ComponentFixture<ListFacultyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFacultyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFacultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
