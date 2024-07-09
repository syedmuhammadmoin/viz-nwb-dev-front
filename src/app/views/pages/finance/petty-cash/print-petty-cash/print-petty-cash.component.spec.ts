import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPettyCashComponent } from './print-petty-cash.component';

describe('PrintPettyCashComponent', () => {
  let component: PrintPettyCashComponent;
  let fixture: ComponentFixture<PrintPettyCashComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintPettyCashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPettyCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
