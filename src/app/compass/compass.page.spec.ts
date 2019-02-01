import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompassPage } from './compass.page';

describe('CompassPage', () => {
  let component: CompassPage;
  let fixture: ComponentFixture<CompassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompassPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
