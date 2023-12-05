import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileConsistencyCheckComponent } from './file-consistency-check.component';

describe('FileConsistencyCheckComponent', () => {
  let component: FileConsistencyCheckComponent;
  let fixture: ComponentFixture<FileConsistencyCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileConsistencyCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileConsistencyCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
