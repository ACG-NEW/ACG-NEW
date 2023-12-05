import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAccessGroupMappingComponent } from './role-access-group-mapping.component';

describe('RoleAccessGroupMappingComponent', () => {
  let component: RoleAccessGroupMappingComponent;
  let fixture: ComponentFixture<RoleAccessGroupMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleAccessGroupMappingComponent]
    });
    fixture = TestBed.createComponent(RoleAccessGroupMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
