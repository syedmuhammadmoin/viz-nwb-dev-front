import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridButtonCellRendrerComponent } from './ag-grid-button-cell-rendrer.component';

describe('AgGridButtonCellRendrerComponent', () => {
  let component: AgGridButtonCellRendrerComponent;
  let fixture: ComponentFixture<AgGridButtonCellRendrerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgGridButtonCellRendrerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridButtonCellRendrerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
