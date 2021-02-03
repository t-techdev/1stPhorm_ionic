import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricListComponent } from './metric-list.component';

describe('MetricListComponent', () => {
  let component: MetricListComponent;
  let fixture: ComponentFixture<MetricListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
