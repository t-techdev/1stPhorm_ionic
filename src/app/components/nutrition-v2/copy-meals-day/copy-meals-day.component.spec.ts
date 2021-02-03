import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyMealsDayComponent } from './copy-meals-day.component';

describe('CopyMealsDayComponent', () => {
  let component: CopyMealsDayComponent;
  let fixture: ComponentFixture<CopyMealsDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyMealsDayComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyMealsDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
