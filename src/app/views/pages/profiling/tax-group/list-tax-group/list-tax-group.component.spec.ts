import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTaxGroupComponent } from './list-tax-group.component';

describe('ListTaxGroupComponent', () => {
  let component: ListTaxGroupComponent;
  let fixture: ComponentFixture<ListTaxGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTaxGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListTaxGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
