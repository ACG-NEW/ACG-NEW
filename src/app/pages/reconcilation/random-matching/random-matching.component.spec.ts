import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomMatchingComponent } from './random-matching.component';

describe('RandomMatchingComponent', () => {
  let component: RandomMatchingComponent;
  let fixture: ComponentFixture<RandomMatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomMatchingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
