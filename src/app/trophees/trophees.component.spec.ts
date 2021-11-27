import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TropheesComponent } from './trophees.component';

describe('TropheesComponent', () => {
  let component: TropheesComponent;
  let fixture: ComponentFixture<TropheesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TropheesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TropheesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
