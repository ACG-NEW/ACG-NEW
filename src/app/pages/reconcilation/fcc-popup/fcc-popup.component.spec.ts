import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FccPopupComponent } from './fcc-popup.component';

describe('FccPopupComponent', () => {
  let component: FccPopupComponent;
  let fixture: ComponentFixture<FccPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FccPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FccPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
