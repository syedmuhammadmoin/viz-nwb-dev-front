import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintJournalComponent } from './print-journal.component';

describe('PrintJournalComponent', () => {
  let component: PrintJournalComponent;
  let fixture: ComponentFixture<PrintJournalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintJournalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
