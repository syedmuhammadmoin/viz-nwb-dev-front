import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDisposalComponent } from './list-disposal.component';

describe('ListDisposalComponent', () => {
  let component: ListDisposalComponent;
  let fixture: ComponentFixture<ListDisposalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDisposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDisposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
