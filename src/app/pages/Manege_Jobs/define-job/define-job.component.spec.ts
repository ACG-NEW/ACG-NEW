import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineJobComponent } from './define-job.component';

describe('DefineJobComponent', () => {
  let component: DefineJobComponent;
  let fixture: ComponentFixture<DefineJobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefineJobComponent]
    });
    fixture = TestBed.createComponent(DefineJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
