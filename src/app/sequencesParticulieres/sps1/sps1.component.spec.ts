import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SPS1Component } from './sps1.component';

describe('SPS1Component', () => {
  let component: SPS1Component;
  let fixture: ComponentFixture<SPS1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SPS1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SPS1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
