import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesPointsComponent } from './acces-points.component';

describe('AccesPointsComponent', () => {
  let component: AccesPointsComponent;
  let fixture: ComponentFixture<AccesPointsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccesPointsComponent]
    });
    fixture = TestBed.createComponent(AccesPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
