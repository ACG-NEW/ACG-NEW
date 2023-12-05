import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleBusinessEntityMappingComponent } from './role-business-entity-mapping.component';

describe('RoleBusinessEntityMappingComponent', () => {
  let component: RoleBusinessEntityMappingComponent;
  let fixture: ComponentFixture<RoleBusinessEntityMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleBusinessEntityMappingComponent]
    });
    fixture = TestBed.createComponent(RoleBusinessEntityMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
