import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIssuanceComponent } from './list-issuance.component';

describe('ListIssuanceComponent', () => {
  let component: ListIssuanceComponent;
  let fixture: ComponentFixture<ListIssuanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListIssuanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListIssuanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
