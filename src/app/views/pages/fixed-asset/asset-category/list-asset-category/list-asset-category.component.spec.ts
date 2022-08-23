import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAssetCategoryComponent } from './list-asset-category.component';

describe('ListAssetCategoryComponent', () => {
  let component: ListAssetCategoryComponent;
  let fixture: ComponentFixture<ListAssetCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAssetCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAssetCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
