import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCreditNoteComponent } from './print-credit-note.component';

describe('PrintCreditNoteComponent', () => {
  let component: PrintCreditNoteComponent;
  let fixture: ComponentFixture<PrintCreditNoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintCreditNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCreditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
