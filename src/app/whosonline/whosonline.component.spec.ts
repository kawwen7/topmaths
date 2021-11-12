import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhosonlineComponent } from './whosonline.component';

describe('WhosonlineComponent', () => {
  let component: WhosonlineComponent;
  let fixture: ComponentFixture<WhosonlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhosonlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhosonlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
