import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCallQuotaionComponent } from './list-call-quotaion.component';

describe('ListCallQuotaionComponent', () => {
  let component: ListCallQuotaionComponent;
  let fixture: ComponentFixture<ListCallQuotaionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCallQuotaionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCallQuotaionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
