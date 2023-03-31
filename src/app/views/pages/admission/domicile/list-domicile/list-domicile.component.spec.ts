import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDomicileComponent } from './list-domicile.component';

describe('ListDomicileComponent', () => {
  let component: ListDomicileComponent;
  let fixture: ComponentFixture<ListDomicileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDomicileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDomicileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
