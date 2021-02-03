import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalContactPage } from './personal-contact.page';

describe('PersonalContactPage', () => {
  let component: PersonalContactPage;
  let fixture: ComponentFixture<PersonalContactPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalContactPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalContactPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
