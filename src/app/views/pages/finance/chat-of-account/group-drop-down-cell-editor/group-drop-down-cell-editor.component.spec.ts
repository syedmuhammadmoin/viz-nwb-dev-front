import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDropDownCellEditorComponent } from './group-drop-down-cell-editor.component';

describe('GroupDropDownCellEditorComponent', () => {
  let component: GroupDropDownCellEditorComponent;
  let fixture: ComponentFixture<GroupDropDownCellEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupDropDownCellEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupDropDownCellEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
