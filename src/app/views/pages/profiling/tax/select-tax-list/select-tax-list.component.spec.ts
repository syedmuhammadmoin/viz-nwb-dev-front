import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTaxListComponent } from './select-tax-list.component';

describe('SelectTaxListComponent', () => {
  let component: SelectTaxListComponent;
  let fixture: ComponentFixture<SelectTaxListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTaxListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectTaxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
