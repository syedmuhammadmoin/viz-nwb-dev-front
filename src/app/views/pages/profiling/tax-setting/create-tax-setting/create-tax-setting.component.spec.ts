import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTaxSettingComponent } from './create-tax-setting.component';

describe('CreateTaxSettingComponent', () => {
  let component: CreateTaxSettingComponent;
  let fixture: ComponentFixture<CreateTaxSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateTaxSettingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateTaxSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
