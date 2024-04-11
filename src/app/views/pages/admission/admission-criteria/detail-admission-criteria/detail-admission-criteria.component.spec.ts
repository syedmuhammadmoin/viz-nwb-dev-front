import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAdmissionCriteriaComponent } from './detail-admission-criteria.component';

describe('DetailAdmissionCriteriaComponent', () => {
  let component: DetailAdmissionCriteriaComponent;
  let fixture: ComponentFixture<DetailAdmissionCriteriaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailAdmissionCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAdmissionCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
