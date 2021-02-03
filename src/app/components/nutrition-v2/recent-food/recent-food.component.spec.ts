import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentFoodComponent } from './recent-food.component';

describe('RecentFoodComponent', () => {
  let component: RecentFoodComponent;
  let fixture: ComponentFixture<RecentFoodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentFoodComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
