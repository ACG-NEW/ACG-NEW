import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunreportComponent } from './runreport.component';

describe('RunreportComponent', () => {
  let component: RunreportComponent;
  let fixture: ComponentFixture<RunreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
