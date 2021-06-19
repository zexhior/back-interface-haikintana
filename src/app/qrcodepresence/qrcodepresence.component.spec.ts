import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodepresenceComponent } from './qrcodepresence.component';

describe('QrcodepresenceComponent', () => {
  let component: QrcodepresenceComponent;
  let fixture: ComponentFixture<QrcodepresenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrcodepresenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodepresenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
