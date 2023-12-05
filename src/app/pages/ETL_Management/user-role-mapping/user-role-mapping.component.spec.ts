import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleMappingComponent } from './user-role-mapping.component';

describe('UserRoleMappingComponent', () => {
  let component: UserRoleMappingComponent;
  let fixture: ComponentFixture<UserRoleMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserRoleMappingComponent]
    });
    fixture = TestBed.createComponent(UserRoleMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
