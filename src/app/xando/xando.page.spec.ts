import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XandoPage } from './xando.page';

describe('XandoPage', () => {
  let component: XandoPage;
  let fixture: ComponentFixture<XandoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XandoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XandoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
