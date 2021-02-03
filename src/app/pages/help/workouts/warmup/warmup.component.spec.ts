import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarmupComponent } from './warmup.component';

describe('WarmupComponent', () => {
  let component: WarmupComponent;
  let fixture: ComponentFixture<WarmupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarmupComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarmupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
