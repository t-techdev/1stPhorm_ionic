import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalkthruItemComponent } from './walkthru-item.component';

describe('WalkthruItemComponent', () => {
  let component: WalkthruItemComponent;
  let fixture: ComponentFixture<WalkthruItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalkthruItemComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkthruItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
