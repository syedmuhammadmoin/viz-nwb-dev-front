import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGoodsReturnNoteComponent } from './create-goods-return-note.component';

describe('CreateGoodsReturnNoteComponent', () => {
  let component: CreateGoodsReturnNoteComponent;
  let fixture: ComponentFixture<CreateGoodsReturnNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGoodsReturnNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGoodsReturnNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
