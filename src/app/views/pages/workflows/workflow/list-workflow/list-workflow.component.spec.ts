import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWorkflowComponent } from './list-workflow.component';

describe('ListWorkflowComponent', () => {
  let component: ListWorkflowComponent;
  let fixture: ComponentFixture<ListWorkflowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
