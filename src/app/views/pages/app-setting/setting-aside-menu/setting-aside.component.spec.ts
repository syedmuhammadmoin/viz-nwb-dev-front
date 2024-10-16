import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingAsideComponent } from './setting-aside.component';

describe('SettingAsideComponent', () => {
  let component: SettingAsideComponent;
  let fixture: ComponentFixture<SettingAsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingAsideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
