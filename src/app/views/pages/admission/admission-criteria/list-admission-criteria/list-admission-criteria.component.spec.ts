import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAdmissionCriteriaComponent } from './list-admission-criteria.component';

describe('ListAdmissionCriteriaComponent', () => {
  let component: ListAdmissionCriteriaComponent;
  let fixture: ComponentFixture<ListAdmissionCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAdmissionCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAdmissionCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
