import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitJobComponent } from './submit-job.component';

describe('SubmitJobComponent', () => {
  let component: SubmitJobComponent;
  let fixture: ComponentFixture<SubmitJobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitJobComponent]
    });
    fixture = TestBed.createComponent(SubmitJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
