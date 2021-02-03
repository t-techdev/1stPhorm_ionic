import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortionControlSupplementsComponent } from './portion-control-supplements.component';

describe('PortionControlSupplementsComponent', () => {
  let component: PortionControlSupplementsComponent;
  let fixture: ComponentFixture<PortionControlSupplementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortionControlSupplementsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortionControlSupplementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
