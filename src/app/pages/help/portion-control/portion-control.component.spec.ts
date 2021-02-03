import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortionControlComponent } from './portion-control.component';

describe('PortionControlComponent', () => {
  let component: PortionControlComponent;
  let fixture: ComponentFixture<PortionControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortionControlComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortionControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
