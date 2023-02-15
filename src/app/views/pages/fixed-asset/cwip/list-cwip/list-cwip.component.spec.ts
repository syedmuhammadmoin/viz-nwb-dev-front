import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCwipComponent } from './list-cwip.component';

describe('ListCwipComponent', () => {
  let component: ListCwipComponent;
  let fixture: ComponentFixture<ListCwipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCwipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCwipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
