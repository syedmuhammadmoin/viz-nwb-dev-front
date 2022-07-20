import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIssuanceReturnComponent } from './list-issuance-return.component';

describe('ListIssuanceReturnComponent', () => {
  let component: ListIssuanceReturnComponent;
  let fixture: ComponentFixture<ListIssuanceReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListIssuanceReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListIssuanceReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
