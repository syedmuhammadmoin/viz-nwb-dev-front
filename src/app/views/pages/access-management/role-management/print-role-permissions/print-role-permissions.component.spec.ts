import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRolePermissionsComponent } from './print-role-permissions.component';

describe('PrintRolePermissionsComponent', () => {
  let component: PrintRolePermissionsComponent;
  let fixture: ComponentFixture<PrintRolePermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintRolePermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintRolePermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
