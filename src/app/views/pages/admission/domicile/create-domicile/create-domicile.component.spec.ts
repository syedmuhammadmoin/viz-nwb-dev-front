import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDomicileComponent } from './create-domicile.component';

describe('CreateDomicileComponent', () => {
  let component: CreateDomicileComponent;
  let fixture: ComponentFixture<CreateDomicileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDomicileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDomicileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
