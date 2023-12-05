import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarynoticeComponent } from './summarynotice.component';

describe('SummarynoticeComponent', () => {
  let component: SummarynoticeComponent;
  let fixture: ComponentFixture<SummarynoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarynoticeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarynoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
