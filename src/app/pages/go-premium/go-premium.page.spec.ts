import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoPremiumPage } from './go-premium.page';

describe('GoPremiumPage', () => {
  let component: GoPremiumPage;
  let fixture: ComponentFixture<GoPremiumPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoPremiumPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoPremiumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
