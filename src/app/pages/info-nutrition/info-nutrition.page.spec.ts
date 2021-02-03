import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoNutritionPage } from './info-nutrition.page';

describe('InfoNutritionPage', () => {
  let component: InfoNutritionPage;
  let fixture: ComponentFixture<InfoNutritionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoNutritionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoNutritionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
