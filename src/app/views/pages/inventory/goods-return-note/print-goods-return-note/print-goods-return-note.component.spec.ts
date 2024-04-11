import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintGoodsReturnNoteComponent } from './print-goods-return-note.component';

describe('PrintGoodsReturnNoteComponent', () => {
  let component: PrintGoodsReturnNoteComponent;
  let fixture: ComponentFixture<PrintGoodsReturnNoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintGoodsReturnNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintGoodsReturnNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
