import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesGroupsComponent } from './acces-groups.component';

describe('AccesGroupsComponent', () => {
  let component: AccesGroupsComponent;
  let fixture: ComponentFixture<AccesGroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccesGroupsComponent]
    });
    fixture = TestBed.createComponent(AccesGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
