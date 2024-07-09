import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBatchComponent } from './list-batch.component';

describe('ListBatchComponent', () => {
  let component: ListBatchComponent;
  let fixture: ComponentFixture<ListBatchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
