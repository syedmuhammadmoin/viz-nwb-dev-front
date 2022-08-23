import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDepreciationComponent } from './create-depreciation.component';

describe('CreateDepreciationComponent', () => {
  let component: CreateDepreciationComponent;
  let fixture: ComponentFixture<CreateDepreciationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDepreciationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDepreciationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
