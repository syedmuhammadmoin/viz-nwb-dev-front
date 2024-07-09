import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsReturnNoteDetailComponent } from './goods-return-note-detail.component';

describe('GoodsReturnNoteDetailComponent', () => {
  let component: GoodsReturnNoteDetailComponent;
  let fixture: ComponentFixture<GoodsReturnNoteDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsReturnNoteDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsReturnNoteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
