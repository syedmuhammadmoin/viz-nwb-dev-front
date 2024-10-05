import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTaxGroupComponent } from './create-tax-group.component';

describe('CreateTaxGroupComponent', () => {
  let component: CreateTaxGroupComponent;
  let fixture: ComponentFixture<CreateTaxGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTaxGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateTaxGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
