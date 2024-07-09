import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCityComponent } from './create-city.component';

describe('CreateCityComponent', () => {
  let component: CreateCityComponent;
  let fixture: ComponentFixture<CreateCityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
