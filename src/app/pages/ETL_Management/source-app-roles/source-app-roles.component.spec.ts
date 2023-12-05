import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceAppRolesComponent } from './source-app-roles.component';

describe('SourceAppRolesComponent', () => {
  let component: SourceAppRolesComponent;
  let fixture: ComponentFixture<SourceAppRolesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SourceAppRolesComponent]
    });
    fixture = TestBed.createComponent(SourceAppRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
