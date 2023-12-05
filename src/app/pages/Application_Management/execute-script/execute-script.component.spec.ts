import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuteScriptComponent } from './execute-script.component';

describe('ExecuteScriptComponent', () => {
  let component: ExecuteScriptComponent;
  let fixture: ComponentFixture<ExecuteScriptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExecuteScriptComponent]
    });
    fixture = TestBed.createComponent(ExecuteScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
