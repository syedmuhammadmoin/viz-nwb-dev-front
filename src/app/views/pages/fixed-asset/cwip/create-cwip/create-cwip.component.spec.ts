import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCwipComponent } from './create-cwip.component';

describe('CreateCwipComponent', () => {
  let component: CreateCwipComponent;
  let fixture: ComponentFixture<CreateCwipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCwipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCwipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
