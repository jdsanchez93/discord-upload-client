import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadClipComponent } from './upload-clip.component';

describe('UploadClipComponent', () => {
  let component: UploadClipComponent;
  let fixture: ComponentFixture<UploadClipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadClipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadClipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
