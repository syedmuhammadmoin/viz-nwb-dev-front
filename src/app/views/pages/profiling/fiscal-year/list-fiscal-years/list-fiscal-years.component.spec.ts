import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFiscalYearsComponent } from './list-fiscal-years.component';

describe('ListFiscalYearsComponent', () => {
  let component: ListFiscalYearsComponent;
  let fixture: ComponentFixture<ListFiscalYearsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListFiscalYearsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListFiscalYearsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
