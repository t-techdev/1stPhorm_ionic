import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MacrosConsumedComponent } from './macros-consumed.component';

describe('MacrosConsumedComponent', () => {
  let component: MacrosConsumedComponent;
  let fixture: ComponentFixture<MacrosConsumedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MacrosConsumedComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MacrosConsumedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
