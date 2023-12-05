import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatetransactionComponent } from './createtransaction.component';

describe('CreatetransactionComponent', () => {
  let component: CreatetransactionComponent;
  let fixture: ComponentFixture<CreatetransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatetransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatetransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
