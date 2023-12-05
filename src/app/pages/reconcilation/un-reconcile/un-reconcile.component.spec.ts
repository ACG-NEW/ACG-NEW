import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnReconcileComponent } from './un-reconcile.component';

describe('UnReconcileComponent', () => {
  let component: UnReconcileComponent;
  let fixture: ComponentFixture<UnReconcileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnReconcileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnReconcileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
