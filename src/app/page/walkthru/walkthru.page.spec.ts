import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalkthruPage } from './walkthru.page';

describe('WalkthruPage', () => {
  let component: WalkthruPage;
  let fixture: ComponentFixture<WalkthruPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalkthruPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkthruPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
