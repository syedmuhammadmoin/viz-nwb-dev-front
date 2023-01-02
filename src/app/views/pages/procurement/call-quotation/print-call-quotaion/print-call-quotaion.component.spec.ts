import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCallQuotaionComponent } from './print-call-quotaion.component';

describe('PrintCallQuotaionComponent', () => {
  let component: PrintCallQuotaionComponent;
  let fixture: ComponentFixture<PrintCallQuotaionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintCallQuotaionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCallQuotaionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
