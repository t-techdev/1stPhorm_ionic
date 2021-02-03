import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoContactPage } from './info-contact.page';

describe('InfoContactPage', () => {
  let component: InfoContactPage;
  let fixture: ComponentFixture<InfoContactPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoContactPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoContactPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
