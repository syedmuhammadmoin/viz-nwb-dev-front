import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTaxComponent } from './list-tax.component';

describe('ListTaxComponent', () => {
  let component: ListTaxComponent;
  let fixture: ComponentFixture<ListTaxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
