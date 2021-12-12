import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercicesAuHasardComponent } from './exercices-au-hasard.component';

describe('ExerciceAuHasardComponent', () => {
  let component: ExercicesAuHasardComponent;
  let fixture: ComponentFixture<ExercicesAuHasardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExercicesAuHasardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExercicesAuHasardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
