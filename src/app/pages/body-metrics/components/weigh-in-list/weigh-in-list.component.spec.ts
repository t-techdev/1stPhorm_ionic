import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeighInListComponent } from './weigh-in-list.component';

describe('WeighInListComponent', () => {
  let component: WeighInListComponent;
  let fixture: ComponentFixture<WeighInListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeighInListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeighInListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
