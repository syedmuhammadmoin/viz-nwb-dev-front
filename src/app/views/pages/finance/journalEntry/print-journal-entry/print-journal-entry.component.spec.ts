import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintJournalEntryComponent } from './print-journal-entry.component';

describe('PrintJournalEntryComponent', () => {
  let component: PrintJournalEntryComponent;
  let fixture: ComponentFixture<PrintJournalEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintJournalEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintJournalEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
