import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDisposalComponent } from './print-disposal.component';

describe('PrintDisposalComponent', () => {
  let component: PrintDisposalComponent;
  let fixture: ComponentFixture<PrintDisposalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintDisposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDisposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
