import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceAppUsersComponent } from './source-app-users.component';

describe('SourceAppUsersComponent', () => {
  let component: SourceAppUsersComponent;
  let fixture: ComponentFixture<SourceAppUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SourceAppUsersComponent]
    });
    fixture = TestBed.createComponent(SourceAppUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
