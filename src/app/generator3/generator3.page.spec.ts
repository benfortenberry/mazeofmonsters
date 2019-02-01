import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Generator3Page } from './generator3.page';

describe('Generator3Page', () => {
  let component: Generator3Page;
  let fixture: ComponentFixture<Generator3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Generator3Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Generator3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
