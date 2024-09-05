import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListChartOfAccountComponent } from './list-chart-of-account.component';

describe('ListChartOfAccountComponent', () => {
  let component: ListChartOfAccountComponent;
  let fixture: ComponentFixture<ListChartOfAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListChartOfAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListChartOfAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
