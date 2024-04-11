import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGoodsReturnNoteComponent } from './list-goods-return-note.component';

describe('ListGoodsReturnNoteComponent', () => {
  let component: ListGoodsReturnNoteComponent;
  let fixture: ComponentFixture<ListGoodsReturnNoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGoodsReturnNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGoodsReturnNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
