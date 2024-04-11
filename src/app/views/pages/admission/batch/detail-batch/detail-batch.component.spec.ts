import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBatchComponent } from './detail-batch.component';

describe('DetailBatchComponent', () => {
  let component: DetailBatchComponent;
  let fixture: ComponentFixture<DetailBatchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
