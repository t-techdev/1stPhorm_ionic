import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseAdvisorPage } from './choose-advisor.page';

describe('ChooseAdvisorPage', () => {
  let component: ChooseAdvisorPage;
  let fixture: ComponentFixture<ChooseAdvisorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseAdvisorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseAdvisorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
