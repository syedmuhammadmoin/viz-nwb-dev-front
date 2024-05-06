import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePettyCashComponent } from './create-petty-cash.component';

describe('CreatePettyCashComponent', () => {
  let component: CreatePettyCashComponent;
  let fixture: ComponentFixture<CreatePettyCashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePettyCashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePettyCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
