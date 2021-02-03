import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortionControlMacrosComponent } from './portion-control-macros.component';

describe('PortionControlMacrosComponent', () => {
  let component: PortionControlMacrosComponent;
  let fixture: ComponentFixture<PortionControlMacrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortionControlMacrosComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortionControlMacrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
