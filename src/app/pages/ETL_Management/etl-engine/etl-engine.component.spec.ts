import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtlEngineComponent } from './etl-engine.component';

describe('EtlEngineComponent', () => {
  let component: EtlEngineComponent;
  let fixture: ComponentFixture<EtlEngineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EtlEngineComponent]
    });
    fixture = TestBed.createComponent(EtlEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
