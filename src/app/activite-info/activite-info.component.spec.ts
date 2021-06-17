import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiviteInfoComponent } from './activite-info.component';

describe('ActiviteInfoComponent', () => {
  let component: ActiviteInfoComponent;
  let fixture: ComponentFixture<ActiviteInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiviteInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiviteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
