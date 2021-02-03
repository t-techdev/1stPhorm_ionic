import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortionControlMealComponent } from './portion-control-meal.component';

describe('PortionControlMealComponent', () => {
  let component: PortionControlMealComponent;
  let fixture: ComponentFixture<PortionControlMealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortionControlMealComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortionControlMealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
