import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoWorkoutPage } from './info-workout.page';

describe('InfoWorkoutPage', () => {
  let component: InfoWorkoutPage;
  let fixture: ComponentFixture<InfoWorkoutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoWorkoutPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoWorkoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
