import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomUploadFileComponent } from './custom-upload-file.component';

describe('CustomUploadFileComponent', () => {
  let component: CustomUploadFileComponent;
  let fixture: ComponentFixture<CustomUploadFileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomUploadFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomUploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
