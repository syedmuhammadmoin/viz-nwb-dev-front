import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStatusComponent } from './create-status.component';

describe('CreateStatusComponent', () => {
  let component: CreateStatusComponent;
  let fixture: ComponentFixture<CreateStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
