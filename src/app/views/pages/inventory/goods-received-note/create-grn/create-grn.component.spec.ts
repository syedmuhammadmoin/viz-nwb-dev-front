import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGrnComponent } from './create-grn.component';

describe('CreateGrnComponent', () => {
  let component: CreateGrnComponent;
  let fixture: ComponentFixture<CreateGrnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGrnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
