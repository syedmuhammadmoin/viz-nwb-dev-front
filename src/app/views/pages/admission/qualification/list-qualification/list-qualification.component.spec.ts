import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListQualificationComponent } from './list-qualification.component';

describe('ListQualificationComponent', () => {
  let component: ListQualificationComponent;
  let fixture: ComponentFixture<ListQualificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListQualificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
