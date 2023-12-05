import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDefinedGroupsComponent } from './user-defined-groups.component';

describe('UserDefinedGroupsComponent', () => {
  let component: UserDefinedGroupsComponent;
  let fixture: ComponentFixture<UserDefinedGroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserDefinedGroupsComponent]
    });
    fixture = TestBed.createComponent(UserDefinedGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
