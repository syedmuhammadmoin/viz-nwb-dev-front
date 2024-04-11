import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCountryComponent } from './list-country.component';

describe('ListCountryComponent', () => {
  let component: ListCountryComponent;
  let fixture: ComponentFixture<ListCountryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
