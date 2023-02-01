import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCwipComponent } from './print-cwip.component';

describe('PrintCwipComponent', () => {
  let component: PrintCwipComponent;
  let fixture: ComponentFixture<PrintCwipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintCwipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCwipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
