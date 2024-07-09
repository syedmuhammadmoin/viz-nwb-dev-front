import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBankStatementComponent } from './list-bank-statement.component';

describe('ListBankStatementComponent', () => {
  let component: ListBankStatementComponent;
  let fixture: ComponentFixture<ListBankStatementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBankStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBankStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
