import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridFilterationComponent } from './grid-filteration.component';

describe('GridFilterationComponent', () => {
  let component: GridFilterationComponent;
  let fixture: ComponentFixture<GridFilterationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridFilterationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridFilterationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
