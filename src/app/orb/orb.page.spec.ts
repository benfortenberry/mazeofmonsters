import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrbPage } from './orb';

describe('OrbPage', () => {
  let component: OrbPage;
  let fixture: ComponentFixture<OrbPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrbPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrbPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
