import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStateComponent } from './create-state.component';

describe('CreateStateComponent', () => {
  let component: CreateStateComponent;
  let fixture: ComponentFixture<CreateStateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
