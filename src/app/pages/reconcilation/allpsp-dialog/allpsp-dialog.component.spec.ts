import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllpspDialogComponent } from './allpsp-dialog.component';

describe('AllpspDialogComponent', () => {
  let component: AllpspDialogComponent;
  let fixture: ComponentFixture<AllpspDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllpspDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllpspDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
