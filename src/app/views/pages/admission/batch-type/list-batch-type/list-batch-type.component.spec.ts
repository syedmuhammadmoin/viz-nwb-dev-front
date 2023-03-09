import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBatchTypeComponent } from './list-batch-type.component';

describe('ListBatchTypeComponent', () => {
  let component: ListBatchTypeComponent;
  let fixture: ComponentFixture<ListBatchTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBatchTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBatchTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
